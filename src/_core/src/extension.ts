import { UUID } from '@lumino/coreutils';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILabShell,
} from '@jupyterlab/application';
import { NotebookActions, INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { IEditorTracker, FileEditor } from '@jupyterlab/fileeditor';

import { MainAreaWidget, ICommandPalette } from '@jupyterlab/apputils';

import { IOutsourceror, PLUGIN_ID } from '.';
import { Sourceror } from './sourceror';
import { NotebookOutsourceButton } from './buttons/notebook';
import { FileEditorOutsourceButton } from './buttons/editor';

import '../style/index.css';

const extension: JupyterFrontEndPlugin<IOutsourceror> = {
  id: PLUGIN_ID,
  autoStart: true,
  provides: IOutsourceror,
  requires: [ILabShell, ICommandPalette, INotebookTracker, IEditorTracker],
  activate: (
    app: JupyterFrontEnd,
    shell: ILabShell,
    palette: ICommandPalette,
    notebooks: INotebookTracker,
    editors: IEditorTracker
  ): IOutsourceror => {
    const { commands } = app;
    const sourceror = new Sourceror({ notebooks, editors });

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
          console.log('execute', ed, options.text);
          commands.execute('console:inject', {
            activate: false,
            code: options.text,
            path: ed.context.path,
          });
          executed = true;
        }
      });
    });

    sourceror.factoryRegistered.connect((_, factory) => {
      const command = `${CommandIds.newSource}-${factory.id}`;
      const category = 'Notebook Cell Operations';
      commands.addCommand(command, {
        label: `Create new ${factory.name} for input`,
        isEnabled: () => (factory.isEnabled ? factory.isEnabled(sourceror) : true),
        execute: async (options: any) => {
          shell.activateById(options.widgetId);
          const current = shell.activeWidget as MainAreaWidget;
          // // Clone the OutputArea
          // const current = getCurrent();

          if (current == null || current.content == null) {
            return;
          }

          if (
            !(current.content instanceof FileEditor || current instanceof NotebookPanel)
          ) {
            return;
          }

          const model =
            current instanceof NotebookPanel
              ? current.content.activeCell?.model
              : current.content instanceof FileEditor
              ? current.content.model
              : null;

          if (model == null) {
            return;
          }

          const content = await factory.createWidget({
            model,
            sourceror,
            widget: current.content,
          });

          // Create a MainAreaWidget
          const widget = new MainAreaWidget({ content });
          widget.id = `Outsource-${factory.id}-${UUID.uuid4()}`;
          widget.title.label = `${factory.name}`;
          widget.title.icon = factory.iconClass;
          widget.title.caption = current.title.label
            ? `For Notebook: ${current.title.label}`
            : 'For Notebook:';
          widget.addClass('jp-Outsource-outsource');
          app.shell.add(widget, 'main', {
            ref: current.id,
            mode: 'split-left',
          });

          current.disposed.connect(() => widget.dispose());
        },
      });
      palette.addItem({ command, category });
    });

    sourceror.widgetRequested.connect((_, options: IOutsourceror.IWidgetOptions) => {
      commands.execute(`${CommandIds.newSource}-${options.factory}`, options as any);
    });

    app.docRegistry.addWidgetExtension(
      'Notebook',
      new NotebookOutsourceButton({ sourceror })
    );

    app.docRegistry.addWidgetExtension(
      'Editor',
      new FileEditorOutsourceButton({ sourceror })
    );

    console.log('🧙 outsourceror enabled');
    return sourceror;
  },
};

export default extension;

namespace CommandIds {
  export const newSource = 'outsource:new-outsource';
}
