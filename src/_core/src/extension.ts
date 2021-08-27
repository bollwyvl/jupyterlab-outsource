import { UUID } from '@lumino/coreutils';
import * as alg from '@lumino/algorithm';
import { Widget } from '@lumino/widgets';

import { MainAreaWidget, ICommandPalette } from '@jupyterlab/apputils';
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILabShell,
  IRouter,
  ILayoutRestorer,
} from '@jupyterlab/application';
import { DocumentWidget } from '@jupyterlab/docregistry';
import { IEditorTracker, FileEditor } from '@jupyterlab/fileeditor';
import { NotebookActions, INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';

import { IOutsourceror, PLUGIN_ID, CommandIds } from '.';
import { Sourceror } from './sourceror';
import { NotebookOutsourceButton } from './buttons/notebook';
import { FileEditorOutsourceButton } from './buttons/editor';

const extension: JupyterFrontEndPlugin<IOutsourceror> = {
  id: PLUGIN_ID,
  autoStart: true,
  provides: IOutsourceror,
  requires: [
    JupyterFrontEnd.IPaths,
    ILayoutRestorer,
    ILabShell,
    IRouter,
    ICommandPalette,
    INotebookTracker,
    IEditorTracker,
  ],
  activate: (
    app: JupyterFrontEnd,
    paths: JupyterFrontEnd.IPaths,
    restorer: ILayoutRestorer,
    shell: ILabShell,
    router: IRouter,
    palette: ICommandPalette,
    notebooks: INotebookTracker,
    editors: IEditorTracker
  ): IOutsourceror => {
    const { commands } = app;
    const sourceror = new Sourceror({ notebooks, editors });

    // Handle state restoration.
    restorer
      .restore(sourceror.tracker, {
        command: CommandIds.newSource,
        args: (widget) => ({ path: widget.path, factory: widget.factory.id }),
        name: (widget) => widget.path,
      })
      .catch(console.warn);

    sourceror.executeCellRequested.connect((_, cell) => {
      let executed = false;
      notebooks.forEach(async (nb) => {
        if (executed || nb.model == null) {
          return;
        }
        let cellCount = nb.model.cells.length;
        for (let i = 0; i < cellCount; i++) {
          if (cell.id === nb.model.cells.get(i).id) {
            let oldIndex = nb.content.activeCellIndex;
            nb.content.activeCellIndex = i;
            await NotebookActions.run(nb.content, nb.context.sessionContext);
            executed = true;
            nb.content.activeCellIndex = oldIndex;
            break;
          }
        }
      });
    });

    sourceror.executeTextRequested.connect((_, options) => {
      let executed = false;
      editors.forEach(async (ed) => {
        if (executed) {
          return false;
        }
        if (ed.content.id === options.widgetId) {
          commands.execute('console:inject', {
            activate: false,
            code: options.text,
            path: ed.context.path,
          });
          executed = true;
        }
      });
    });

    commands.addCommand(CommandIds.newSource, {
      label: (args: IOutsourceror.IOutsourceCommandArgs) => {
        const name = sourceror.factory(args.factory)?.name || 'Outsource';
        return `Create new ${name} for input`;
      },
      isEnabled: (args: IOutsourceror.IOutsourceCommandArgs) => {
        const factory = sourceror.factory(args.factory);
        if (factory == null) {
          return false;
        }
        return factory.isEnabled ? factory.isEnabled(sourceror) : true;
      },
      execute: async (args: IOutsourceror.IOutsourceCommandArgs) => {
        const factory = sourceror.factory(args.factory);

        if (factory == null) {
          return false;
        }

        let found: Widget | undefined;
        let retries = 10;

        while (retries && found == null) {
          retries--;
          found = alg.find(shell.widgets('main'), (widget) => {
            return (
              widget instanceof DocumentWidget && widget.context.path === args.path
            );
          });

          if (found != null) {
            break;
          }
          await new Promise((resolve) => setTimeout(() => resolve(), 100));
        }

        if (found == null) {
          console.warn(`${args.path} not found for ${args.factory}`);
        }

        const doc = found as DocumentWidget;

        if (!(doc.content instanceof FileEditor || doc instanceof NotebookPanel)) {
          return;
        }

        const model =
          doc instanceof NotebookPanel
            ? doc.content.activeCell?.model
            : doc.content instanceof FileEditor
            ? doc.content.model
            : null;

        if (model == null) {
          return;
        }

        const content = await factory.createWidget({
          factory,
          path: doc.context.path,
          model,
          sourceror,
          widget: doc.content,
        });

        console.log(content);

        // Create a MainAreaWidget
        const widget = new MainAreaWidget({ content });
        widget.id = `Outsource-${factory.id}-${UUID.uuid4()}`;
        widget.title.label = `${factory.name}`;
        widget.title.icon = factory.iconClass;
        widget.title.caption = doc.title.label
          ? `For Notebook: ${doc.title.label}`
          : 'For Notebook:';
        widget.addClass('jp-Outsource-outsource');
        app.shell.add(widget, 'main', {
          ref: doc.id,
          mode: 'split-left',
        });

        doc.disposed.connect(() => widget.dispose());
        sourceror.tracker.add(content);

        return widget;
      },
    });

    // sourceror.factoryRegistered.connect((_, factory) => {
    //   const command = `${CommandIds.newSource}-${factory.id}`;
    //   const category = 'Notebook Cell Operations';
    //   palette.addItem({ command, category });
    // });

    sourceror.widgetRequested.connect(
      async (_, options: IOutsourceror.IOutsourceCommandArgs) => {
        await commands.execute(CommandIds.newSource, {
          path: options.path,
          factory: options.factory,
        });
      }
    );

    app.docRegistry.addWidgetExtension(
      'Notebook',
      new NotebookOutsourceButton({ sourceror })
    );

    app.docRegistry.addWidgetExtension(
      'Editor',
      new FileEditorOutsourceButton({ sourceror })
    );

    const outsourcePattern = new RegExp(`^${paths.urls.tree}/outsource/([^/]+)/?(.*)`);

    app.commands.addCommand(CommandIds.treeOpen, {
      execute: async (args) => {
        const loc = args as IRouter.ILocation;
        const outsourceMatch = loc.path.match(outsourcePattern);
        console.log(args, loc, outsourceMatch);
        if (outsourceMatch == null) {
          return;
        }
        const [factory, path] = outsourceMatch.slice(1);

        setTimeout(async () => {
          const doc = (await commands.execute('docmanager:open', {
            path,
            factory: 'Editor',
          })) as DocumentWidget;

          await doc.context.ready;

          await commands.execute(CommandIds.newSource, {
            widgetId: doc.id,
            factory,
          });
        }, 0);

        router.navigate(paths.urls.app);

        return router.stop;
      },
    });

    router.register({
      command: CommandIds.treeOpen,
      pattern: outsourcePattern,
      rank: 29,
    });

    return sourceror;
  },
};

export default extension;
