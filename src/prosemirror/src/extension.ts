import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IOutsourceror } from '@deathbeds/jupyterlab-outsource';

import { IOutsourceProsemirror, PLUGIN_ID } from '.';

import { ProsemirrorFactory } from './factory';

import '../style/index.css';
import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-view/style/prosemirror.css';

const extension: JupyterFrontEndPlugin<IOutsourceProsemirror> = {
  id: PLUGIN_ID,
  autoStart: true,
  provides: IOutsourceProsemirror,
  requires: [IOutsourceror],
  activate: (
    _app: JupyterFrontEnd,
    sourceror: IOutsourceror
  ): IOutsourceProsemirror => {
    return sourceror.register(new ProsemirrorFactory());
  }
};

export default extension;
