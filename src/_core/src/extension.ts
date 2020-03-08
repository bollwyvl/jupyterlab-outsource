import { UUID } from '@lumino/coreutils';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import {
  NotebookActions,
  INotebookTracker,
  NotebookPanel
} from '@jupyterlab/notebook';

import { MainAreaWidget, ICommandPalette } from '@jupyterlab/apputils';

import { IOutsourceror, PLUGIN_ID } from '.';
import { Sourceror } from './sourceror';
import { NotebookOutsourceButton } from './button';

import '../style/index.css';

const extension: JupyterFrontEndPlugin<IOutsourceror> = {
  id: PLUGIN_ID,
  autoStart: true,
  provides: IOutsourceror,
  requires: [ICommandPalette, INotebookTracker],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    notebooks: INotebookTracker
  ): IOutsourceror => {
    const { commands } = app;
    const sourceror = new Sourceror({ notebooks });

    // Get the current widget and activate unless the args specify otherwise.
    function getCurrent(): NotebookPanel | null {
      return notebooks.currentWidget;
    }

    sourceror.executeRequested.connect((_, cell) => {
      let executed = false;
      notebooks.forEach(async nb => {
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

    sourceror.factoryRegistered.connect((_, factory) => {
      const command = `${CommandIds.newSource}-${factory.id}`;
      const category = 'Notebook Cell Operations';
      commands.addCommand(command, {
        label: `Create new ${factory.name} for input`,
        isEnabled: () =>
          factory.isEnabled ? factory.isEnabled(sourceror) : true,
        execute: async () => {
          // Clone the OutputArea
          const current = getCurrent();

          if (!current) {
            return;
          }

          const nb = current.content;

          if (nb == null || nb.activeCell == null) {
            return;
          }

          const model = nb.activeCell.model;
          const content = await factory.createWidget({ model });

          // Create a MainAreaWidget
          const widget = new MainAreaWidget({ content });
          widget.id = `Outsource-${factory.id}-${UUID.uuid4()}`;
          widget.title.label = `${factory.name}`;
          widget.title.icon = factory.iconClass;
          widget.title.caption = current.title.label
            ? `For Notebook: ${current.title.label}`
            : 'For Notebook:';
          widget.addClass('jp-Outsource-outsource');
          current.context.addSibling(widget, {
            ref: current.id,
            mode: 'split-left'
          });

          // Remove the output view if the parent notebook is closed.
          nb.disposed.connect(widget.dispose);
        }
      });
      palette.addItem({ command, category });
    });

    sourceror.widgetRequested.connect((_, factoryId) => {
      commands.execute(`${CommandIds.newSource}-${factoryId}`);
    });

    const outsourceButton = new NotebookOutsourceButton({ sourceror });
    outsourceButton.sourceror = sourceror;

    app.docRegistry.addWidgetExtension('Notebook', outsourceButton);

    console.info('🧙 outsourceror enabled');
    return sourceror;
  }
};

export default extension;

namespace CommandIds {
  export const newSource = 'outsource:new-outsource';
}
