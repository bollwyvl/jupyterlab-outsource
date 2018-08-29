import {UUID} from '@phosphor/coreutils';

import {JupyterLab, JupyterLabPlugin} from '@jupyterlab/application';
import {INotebookTracker, NotebookPanel} from '@jupyterlab/notebook';

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
    const sourceror = new Sourcerer({notebooks});

    // Get the current widget and activate unless the args specify otherwise.
    function getCurrent(): NotebookPanel | null {
      return notebooks.currentWidget;
    }

    sourceror.factoryRegistered.connect((_, factory) => {
      const command = `${CommandIds.newSource}-${factory.id}`;
      const category = 'Notebook Cell Operations';
      commands.addCommand(command, {
        label: `Create new ${factory.name} for input`,
        isEnabled: () => (factory.isEnabled ? factory.isEnabled(sourceror) : true),
        execute: async () => {
          // Clone the OutputArea
          const current = getCurrent();
          const nb = current.content;
          const model = nb.activeCell.model;
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
