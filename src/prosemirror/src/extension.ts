import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IOutsourceror } from '@deathbeds/jupyterlab-outsource';

import { IOutsourceProsemirror, PLUGIN_ID } from '.';

import { ProsemirrorFactory } from './factory';

(window as any).from_prosemirror = IOutsourceror;


const extension: JupyterFrontEndPlugin<IOutsourceProsemirror> = {
  id: PLUGIN_ID,
  autoStart: true,
  provides: IOutsourceProsemirror,
  requires: [IOutsourceror],
  activate: (
    _app: JupyterFrontEnd,
    sourceror: IOutsourceror
  ): IOutsourceProsemirror => {
    console.info('✒️ prosemirror enabled');
    return sourceror.register(new ProsemirrorFactory());
  }
};

export default extension;
