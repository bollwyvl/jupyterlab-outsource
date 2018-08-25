import {ReadonlyJSONObject} from '@phosphor/coreutils';
import {UUID} from '@phosphor/coreutils';

import {JupyterLab, JupyterLabPlugin} from '@jupyterlab/application';
import {INotebookTracker, NotebookPanel} from '@jupyterlab/notebook';

import {MarkdownCell} from '@jupyterlab/cells';
import {MainAreaWidget, ICommandPalette} from '@jupyterlab/apputils';

import {IOutsourcerer, PLUGIN_ID} from '.';
import {Sourcerer} from './sourcerer';

import '../style/index.css';

const extension: JupyterLabPlugin<IOutsourcerer> = {
  id: PLUGIN_ID,
  autoStart: true,
  provides: IOutsourcerer,
  requires: [ICommandPalette, INotebookTracker],
  activate: (
    app: JupyterLab,
    palette: ICommandPalette,
    notebooks: INotebookTracker
  ): IOutsourcerer => {
    const {commands} = app;
    const sourceror = new Sourcerer();
    console.log(`let's get sourcing ${app} ${notebooks}`);

    // Get the current widget and activate unless the args specify otherwise.
    function getCurrent(args: ReadonlyJSONObject): NotebookPanel | null {
      const widget = notebooks.currentWidget;
      const activate = args['activate'] !== false;

      if (activate && widget) {
        app.shell.activateById(widget.id);
      }

      return widget;
    }

    sourceror.factoryRegistered.connect((_, factory) => {
      const command = `${CommandIds.newSource}-${factory.id}`;
      const category = 'Notebook Cell Operations';
      commands.addCommand(command, {
        label: `Create new ${factory.name} for input`,
        execute: async (args) => {
          // Clone the OutputArea
          const current = getCurrent({...args, activate: false});
          const nb = current.content;
          const model = (nb.activeCell as MarkdownCell).model;
          const content = await factory.createWidget({model});

          // Create a MainAreaWidget
          const widget = new MainAreaWidget({content});
          widget.id = `Outsource-${factory.id}-${UUID.uuid4()}`;
          widget.title.label = `${factory.name}`;
          widget.title.icon = factory.iconClass;
          widget.title.caption = current.title.label
            ? `For Notebook: ${current.title.label}`
            : 'For Notebook:';
          widget.addClass('jp-Outsource-outsource');
          current.context.addSibling(widget, {
            ref: current.id,
            mode: 'split-bottom',
          });

          // Remove the output view if the parent notebook is closed.
          nb.disposed.connect(widget.dispose);
        },
      });
      palette.addItem({command, category});
    });
    return sourceror;
  },
};

export default extension;

namespace CommandIds {
  export const newSource = 'outsource:new-outsource';
}
