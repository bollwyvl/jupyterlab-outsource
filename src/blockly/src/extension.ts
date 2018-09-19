import {JupyterLab, JupyterLabPlugin} from '@jupyterlab/application';

import {IOutsourcerer} from '@deathbeds/jupyterlab-outsource';

import {IOutsourceBlockly, PLUGIN_ID} from '.';

import {BlocklyFactory} from './factory';

import '../style/index.css';
import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-view/style/prosemirror.css';

const extension: JupyterLabPlugin<IOutsourceBlockly> = {
  id: PLUGIN_ID,
  autoStart: true,
  provides: IOutsourceBlockly,
  requires: [IOutsourcerer],
  activate: (app: JupyterLab, sourcerer: IOutsourcerer): IOutsourceBlockly => {
    console.log(`let's get blocklying ${app} ${sourcerer}`);
    return sourcerer.register(new BlocklyFactory());
  },
};

export default extension;
