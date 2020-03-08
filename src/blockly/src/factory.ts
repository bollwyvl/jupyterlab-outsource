import { Widget } from '@lumino/widgets';

import { IOutsourceror } from '@deathbeds/jupyterlab-outsource';

import * as widget from './widget';

export class BlocklyFactory implements IOutsourceror.IFactory {
  readonly id = 'blockly';
  readonly name = 'Blockly';
  readonly iconClass = 'jp-Outsource-BlocklyIcon';

  constructor(sourceror: IOutsourceror) {
    widget.SOURCEROR.instance = sourceror;
  }

  isEnabled(sourceror: IOutsourceror) {
    return sourceror.isCodeCell;
  }

  async createWidget(options: IOutsourceror.IFactoryOptions): Promise<Widget> {
    const { BlocklySource } = await import(
      /* webpackChunkName: "blockly" */ './widget'
    );
    return new BlocklySource(options);
  }
}
