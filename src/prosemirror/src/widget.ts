import {Widget} from '@phosphor/widgets';

import {IMarkdownCellModel} from '@jupyterlab/cells';

import {EditorState, Transaction} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import * as Markdown from 'prosemirror-markdown';
import {IOutsourceFactoryOptions} from '@deathbeds/jupyterlab-outsource';
import * as exampleSetup from 'prosemirror-example-setup';

import {CSS} from '.';

export class ProseMirrorSource extends Widget {
  private _model: IMarkdownCellModel;
  private _wrapper: HTMLDivElement;
  private _view: EditorView<any>;

  constructor(options: IOutsourceFactoryOptions) {
    super();

    this._model = options.model as IMarkdownCellModel;
    this._model.contentChanged.connect(() => {
      console.log('contents changed', arguments);
      let source = this._model.toJSON().source;
      this._view.state = EditorState.create({
        doc: (Markdown as any).defaultMarkdownParser.parse(typeof source === 'string' ? source : source.join('')),
        plugins: (exampleSetup as any).exampleSetup({schema: (Markdown as any).schema})
      });
    });

    this.node.appendChild(this._wrapper = document.createElement('div'));
    this._wrapper.className = CSS.WRAPPER;

    let fakeNode = document.createElement('h1');
    fakeNode.textContent = 'hello';
    let that = this;
    let source = this._model.toJSON().source;

    this._view = new EditorView(this._wrapper, {
      state: EditorState.create({
        doc: (Markdown as any).defaultMarkdownParser.parse(typeof source === 'string' ? source : source.join('')),
        plugins: (exampleSetup as any).exampleSetup({schema: (Markdown as any).schema})
      }),
      dispatchTransaction(transaction: Transaction) { that._dispatch(transaction); },
    });
  }

  private _dispatch(transaction: Transaction) {
    const newState = this._view.state.apply(transaction);
    this._view.updateState(newState);
    console.log('dispatch', transaction, newState);
    this._model.value.text = (Markdown as any).defaultMarkdownSerializer.serialize(this._view.state.doc);
    // menu.dispatch(newState);
  }
}
