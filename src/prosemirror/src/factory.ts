import { Widget } from '@lumino/widgets';

import { IOutsourceror } from '@deathbeds/jupyterlab-outsource';

export class ProsemirrorFactory implements IOutsourceror.IFactory {
  readonly id = 'prosemirror';
  readonly name = 'ProseMirror';
  readonly iconClass = 'jp-Outsource-ProseMirrorIcon';

  isEnabled(sourceror: IOutsourceror) {
    return sourceror.isMarkdownCell || sourceror.isCodeCell;
  }

  async createWidget(options: IOutsourceror.IFactoryOptions): Promise<Widget> {
    const { ProseMirrorSource } = await import(
      /* webpackChunkName: "prosemirror" */ './widget'
    );
    return new ProseMirrorSource(options);
  }
}
