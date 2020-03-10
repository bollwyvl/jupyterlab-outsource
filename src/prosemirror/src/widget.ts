import { Widget } from '@lumino/widgets';
import { IObservableString } from '@jupyterlab/observables';

import { CodeEditor } from '@jupyterlab/codeeditor';

import { EditorState, Transaction } from 'prosemirror-state';
import { Schema, Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import * as Markdown from 'prosemirror-markdown';
import { IOutsourceror } from '@deathbeds/jupyterlab-outsource';
import { exampleSetup } from 'prosemirror-example-setup';

import { CSS } from '.';

import '../style/index.css';
import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-view/style/prosemirror.css';
import { arrowHandlers, CodeBlockView } from './blocks/editor';

const SCHEMA = (Markdown as any).schema as Schema;

export class ProseMirrorSource extends Widget {
  private _model: CodeEditor.IModel;
  private _wrapper: HTMLDivElement;
  private _view: EditorView<any>;
  private _lastSource: string = '';
  // TODO: add execution based on parent widget's kernel
  // private _widget: Widget;

  constructor(options: IOutsourceror.IFactoryOptions) {
    super();
    this.addClass(CSS.OUTER_WRAPPER);
    this.addClass('jp-RenderedHTMLCommon');
    this._model = options.model;
    this._model.value.changed.connect(this._contentChanged, this);
    // this._widget = options.widget;

    this.node.appendChild((this._wrapper = document.createElement('div')));
    this._wrapper.className = CSS.WRAPPER;

    let that = this;
    let source = this._model.value.text;

    this._view = new EditorView(this._wrapper, {
      nodeViews: {
        code_block: (node: Node, view: EditorView, getPos: () => number) => {
          return new CodeBlockView(node, view, getPos, SCHEMA);
        },
      },
      state: EditorState.create({
        doc: Markdown.defaultMarkdownParser.parse(source),
        plugins: [
          ...exampleSetup({ schema: SCHEMA }),
          arrowHandlers,
        ],
      }),
      dispatchTransaction(transaction: Transaction) {
        that._pmChanged(transaction);
      },
    });
  }

  dispose() {
    this._model.value.changed.disconnect(this._contentChanged, this);
    super.dispose();
  }

  private _pmChanged(transaction: Transaction) {
    const newState = this._view.state.apply(transaction);
    this._view.updateState(newState);
    this._lastSource = (Markdown as any).defaultMarkdownSerializer.serialize(
      this._view.state.doc
    );
    if (this._lastSource.trim() === this._model.value.text.trim()) {
      return;
    }
    this._model.value.text = this._lastSource;
  }

  private _contentChanged(
    model: IObservableString,
    change: IObservableString.IChangedArgs
  ) {
    let source = this._model.value.text || '';
    if (this._lastSource && this._lastSource.trim() === source.trim()) {
      return;
    }
    this._lastSource = source;
    this._view.updateState(
      EditorState.create({
        doc: (Markdown as any).defaultMarkdownParser.parse(source),
        plugins: exampleSetup({
          schema: SCHEMA,
        }),
      })
    );
  }
}
