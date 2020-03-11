import { CodeBlockView, arrowHandlers } from './editor';
import { IOutsourceProsemirror } from '..';
import { Schema, Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

export class ExecuteCodeBlockView extends CodeBlockView {
  codeMirrorKeymap() {
    const { keymap } = super.codeMirrorKeymap();
    let view = this.view;
    return {
      ...keymap,
      [`Shift-Enter`]: () => console.log('whatever', view),
    };
  }
}

export function executeExtension(schema: Schema): IOutsourceProsemirror.IExtensionPoints {
  return {
    nodes: {
      code_block: {...schema.nodes.code_block, isolating: true} as any
    },
    nodeViews: {
      code_block: (node: Node, view: EditorView, getPos: () => number) => {
        return new ExecuteCodeBlockView(node, view, getPos, schema);
      },
    },
    plugins: [
      arrowHandlers
    ]
  }
}
