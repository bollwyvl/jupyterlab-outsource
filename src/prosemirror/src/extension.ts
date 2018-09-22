import {JupyterLab, JupyterLabPlugin} from '@jupyterlab/application';

import {IOutsourcerer} from '@deathbeds/jupyterlab-outsource';

import {IOutsourceProsemirror, PLUGIN_ID} from '.';

import {ProsemirrorFactory} from './factory';

import '../style/index.css';
import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-view/style/prosemirror.css';

const extension: JupyterLabPlugin<IOutsourceProsemirror> = {
  id: PLUGIN_ID,
  autoStart: true,
  provides: IOutsourceProsemirror,
  requires: [IOutsourcerer],
  activate: (app: JupyterLab, sourcerer: IOutsourcerer): IOutsourceProsemirror => {
    return sourcerer.register(new ProsemirrorFactory());
  },
};

export default extension;
