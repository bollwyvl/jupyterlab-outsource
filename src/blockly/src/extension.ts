import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IOutsourceror } from '@deathbeds/jupyterlab-outsource';

import { IOutsourceBlockly, PLUGIN_ID } from '.';

import { BlocklyFactory } from './factory';

const extension: JupyterFrontEndPlugin<IOutsourceBlockly> = {
  id: PLUGIN_ID,
  autoStart: true,
  provides: IOutsourceBlockly,
  requires: [IOutsourceror],
  activate: (
    _app: JupyterFrontEnd,
    sourceror: IOutsourceror
  ): IOutsourceBlockly => {
    console.log('🧩 blockly enabled');
    return sourceror.register(new BlocklyFactory(sourceror));
  }
};

export default extension;
