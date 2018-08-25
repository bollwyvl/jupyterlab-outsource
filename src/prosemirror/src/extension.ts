import {JupyterLab, JupyterLabPlugin} from '@jupyterlab/application';

import {IOutsource} from '@deathbeds/jupyterlab-outsource';

import {IOutsourceProsemirror, PLUGIN_ID} from '.';

import '../style/index.css';

const extension: JupyterLabPlugin<IOutsourceProsemirror> = {
  id: PLUGIN_ID,
  autoStart: true,
  provides: IOutsourceProsemirror,
  requires: [IOutsource],
  activate: (app: JupyterLab, sourcerer: IOutsource): IOutsourceProsemirror => {
    console.log(`let's get prosemirroring ${app} ${sourcerer}`);
    return null;
  },
};

export default extension;
