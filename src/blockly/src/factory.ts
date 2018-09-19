import {Widget} from '@phosphor/widgets';

import {
  IOutsourceFactory,
  IOutsourceFactoryOptions,
  IOutsourcerer,
} from '@deathbeds/jupyterlab-outsource';

export class BlocklyFactory implements IOutsourceFactory {
  readonly id = 'blockly';
  readonly name = 'Blockly';
  readonly iconClass = 'jp-Outsource-BlocklyIcon';

  isEnabled(sourceror: IOutsourcerer) {
    return sourceror.isCodeCell;
  }

  async createWidget(options: IOutsourceFactoryOptions): Promise<Widget> {
    return await new Promise<Widget>((resolve, reject) => {
      require.ensure(
        ['./widget'],
        (require) => resolve(new (require('./widget')).BlocklySource(options)),
        (error: any) => [console.error(error), reject()],
        'blockly'
      );
    });
  }
}
