import { Token, ReadonlyPartialJSONObject } from '@lumino/coreutils';
import { Widget } from '@lumino/widgets';
import { ISignal } from '@lumino/signaling';

import { ICellModel } from '@jupyterlab/cells';
import { INotebookTracker } from '@jupyterlab/notebook';
import { CodeEditor } from '@jupyterlab/codeeditor';
import { IEditorTracker } from '@jupyterlab/fileeditor';
import { WidgetTracker } from '@jupyterlab/apputils';
import { LabIcon } from '@jupyterlab/ui-components';

import * as OUTSOURCE_SVG from '../style/img/outsource.svg';

export { Outsource } from './widget';

export const NS = 'outsource';

export const PLUGIN_ID = '@deathbeds/jupyterlab-outsource';

export const IOutsourceror = new Token<IOutsourceror>(PLUGIN_ID);

export interface IOutsourceror {
  ready: Promise<void>;
  register(factory: IOutsourceror.IFactory): IOutsourceror.IFactory;
  factoryRegistered: ISignal<IOutsourceror, IOutsourceror.IFactory>;
  widgetRequested: ISignal<IOutsourceror, IOutsourceror.IOutsourceCommandArgs>;
  isMarkdownCell: boolean;
  isCodeCell: boolean;
  executeCellRequested: ISignal<IOutsourceror, ICellModel>;
  executeTextRequested: ISignal<IOutsourceror, IOutsourceror.IConsoleExecuteOptions>;
  executeCell(cell: ICellModel): void;
  executeText(options: IOutsourceror.IConsoleExecuteOptions): void;
  factories: IOutsourceror.IFactory[];
  factory(id: string): IOutsourceror.IFactory | null;
  requestWidget(options: IOutsourceror.IOutsourceCommandArgs): void;
  tracker: WidgetTracker<IOutsourceror.IOutsource>;
}

export namespace IOutsourceror {
  export interface IOptions {
    notebooks?: INotebookTracker;
    editors?: IEditorTracker;
  }

  export interface IConsoleExecuteOptions {
    text: string;
    widgetId: string;
  }

  export interface IFactory {
    readonly name: string;
    readonly iconClass: string;
    readonly id: string;
    createWidget(options: IFactoryOptions): Promise<IOutsource>;
    isEnabled?(sourceror?: IOutsourceror): boolean;
  }

  export interface IFactoryOptions {
    path: string;
    factory: IOutsourceror.IFactory;
    model: CodeEditor.IModel;
    sourceror: IOutsourceror;
    widget: Widget;
  }

  export interface IWidgetOptions {
    factory: IFactory;
    path: string;
  }

  export interface IOutsourceCommandArgs extends ReadonlyPartialJSONObject {
    factory: string;
    path: string;
  }

  export interface IOutsource extends Widget {
    factory: IFactory;
    path: string;
  }
}

export const CSS = {
  icon: 'jp-OutsourceIcon',
};

export namespace CommandIds {
  export const newSource = 'outsource:new-outsource';
  export const treeOpen = 'outsource:tree-open';
}

export const outsourceIcon = new LabIcon({
  name: `${PLUGIN_ID}:wand`,
  svgstr: OUTSOURCE_SVG.default,
});
