import {JupyterLab, JupyterLabPlugin} from '@jupyterlab/application';
import {INotebookTracker} from '@jupyterlab/notebook';
// import {MainAreaWidget} from '@jupyterlab/apputils';

import {IOutsourcerer, PLUGIN_ID} from '.';

import '../style/index.css';

const extension: JupyterLabPlugin<IOutsourcerer> = {
  id: PLUGIN_ID,
  autoStart: true,
  provides: IOutsourcerer,
  optional: [INotebookTracker],
  activate: (app: JupyterLab, notebooks?: INotebookTracker): IOutsourcerer => {
    console.log(`let's get sourcing ${app} ${notebooks}`);
    return null;
  },
};

export default extension;
