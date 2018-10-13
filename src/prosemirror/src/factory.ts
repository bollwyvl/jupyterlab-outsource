import {Widget} from '@phosphor/widgets';

import {
  IOutsourceFactory,
  IOutsourceFactoryOptions,
  IOutsourcerer,
} from '@deathbeds/jupyterlab-outsource';

export class ProsemirrorFactory implements IOutsourceFactory {
  readonly id = 'prosemirror';
  readonly name = 'ProseMirror';
  readonly iconClass = 'jp-Outsource-ProseMirrorIcon';

  isEnabled(sourceror: IOutsourcerer) {
    return sourceror.isMarkdownCell || sourceror.isCodeCell;
  }

  async createWidget(options: IOutsourceFactoryOptions): Promise<Widget> {
    return await new Promise<Widget>((resolve, reject) => {
      require.ensure(
        ['./widget'],
        (require) => resolve(new (require('./widget')).ProseMirrorSource(options)),
        (error: any) => [console.error(error), reject()],
        'prosemirror'
      );
    });
  }
}
