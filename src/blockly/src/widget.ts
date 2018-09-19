import {Widget} from '@phosphor/widgets';

import {IObservableString} from '@jupyterlab/observables';

import {ICodeCellModel} from '@jupyterlab/cells';

import {IOutsourceFactoryOptions} from '@deathbeds/jupyterlab-outsource';

import Blockly, {IWorkspace} from 'node-blockly/browser';

import {CSS} from '.';

export class BlocklySource extends Widget {
  private _cellModel: ICodeCellModel;
  private _wrapper: HTMLDivElement;
  private _workspace: IWorkspace;
  // private _view: EditorView<any>;
  // private _lastSource: string = '';

  constructor(options: IOutsourceFactoryOptions) {
    super();
    this.addClass(CSS.OUTER_WRAPPER);
    console.log(options);
    this._cellModel = options.model as ICodeCellModel;
    this._cellModel.value.changed.connect(this._contentChanged, this);

    this.node.appendChild((this._wrapper = document.createElement('div')));
    this._wrapper.className = CSS.WRAPPER;
    setTimeout(() => {
      this._workspace = Blockly.inject(this._wrapper, {
        toolbox: `<xml>
          <block type="controls_if"></block>
          <block type="logic_compare"></block>
          <block type="controls_repeat_ext"></block>
          <block type="math_number">
            <field name="NUM">123</field>
          </block>
          <block type="math_arithmetic"></block>
          <block type="text"></block>
          <block type="text_print"></block>
        </xml>`,
      });
      this._workspace.addChangeListener(() => this._workspaceChanged());
    }, 1);
    //
    // let source = this._model.toJSON().source;
    // console.log(source);
    // console.log(BlocklyDrawer);
  }

  private _workspaceChanged() {
    console.log(this._workspace);
    this._cellModel.value.text = Blockly.Python.workspaceToCode(this._workspace).trim();
  }

  // dispose() {
  //   // this._model.value.changed.disconnect(this._contentChanged, this);
  //   super.dispose();
  // }

  // private _pmChanged(transaction: Transaction) {
  //   const newState = this._view.state.apply(transaction);
  //   this._view.updateState(newState);
  //   this._lastSource = (Markdown as any).defaultMarkdownSerializer.serialize(
  //     this._view.state.doc
  //   );
  //   if (this._lastSource.trim() === this._model.value.text.trim()) {
  //     return;
  //   }
  //   this._model.value.text = this._lastSource;
  // }

  private _contentChanged(
    model: IObservableString,
    change: IObservableString.IChangedArgs
  ) {
    console.log('contents', model, change, this.parent.hasClass('jp-mod-active'));
    // let source = this._model.value.text || '';
    // if (this._lastSource && this._lastSource.trim() === source.trim()) {
    //   return;
    // }
    // this._lastSource = source;
    // this._view.updateState(
    //   EditorState.create({
    //     doc: (Markdown as any).defaultMarkdownParser.parse(source),
    //     plugins: (exampleSetup as any).exampleSetup({schema: (Markdown as any).schema}),
    //   })
    // );
  }
}
