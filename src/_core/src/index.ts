import { Token } from '@lumino/coreutils';
import { Widget } from '@lumino/widgets';
import { ISignal } from '@lumino/signaling';

import { ICellModel } from '@jupyterlab/cells';
import { INotebookTracker } from '@jupyterlab/notebook';

export const PLUGIN_ID = '@deathbeds/jupyterlab-outsource';

export const IOutsourceror = new Token<IOutsourceror>(PLUGIN_ID);

export interface IOutsourceror {
  ready: Promise<void>;
  register(factory: IOutsourceror.IFactory): IOutsourceror.IFactory;
  factoryRegistered: ISignal<IOutsourceror, IOutsourceror.IFactory>;
  widgetRequested: ISignal<IOutsourceror, string>;
  isMarkdownCell: boolean;
  isCodeCell: boolean;
  executeRequested: ISignal<IOutsourceror, ICellModel>;
  execute(cell: ICellModel): void;
  factories: IOutsourceror.IFactory[];
  factory(id: string): IOutsourceror.IFactory | null;
  requestWidget(factoryName: string): void;
}

export namespace IOutsourceror {
  export interface IOptions {
    notebooks?: INotebookTracker;
  }

  export interface IFactory {
    readonly name: string;
    readonly iconClass: string;
    readonly id: string;
    createWidget(options: IFactoryOptions): Promise<Widget>;
    isEnabled?(sourceror?: IOutsourceror): boolean;
  }

  export interface IFactoryOptions {
    // FIXME: probably some other upstream model
    model: ICellModel;
    sourceror?: IOutsourceror;
  }
}

export const CSS = {
  icon: 'jp-OutsourceIcon'
};
