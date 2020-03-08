import { PromiseDelegate } from '@lumino/coreutils';
import { Signal } from '@lumino/signaling';
import { INotebookTracker } from '@jupyterlab/notebook';
import { MarkdownCell, CodeCell, ICellModel } from '@jupyterlab/cells';

import { IOutsourceror } from '.';

export class Sourceror implements IOutsourceror {
  private _ready = new PromiseDelegate<void>();
  private _factoryRegistered = new Signal<this, IOutsourceror.IFactory>(this);
  private _executeRequested = new Signal<this, ICellModel>(this);
  private _widgetRequested = new Signal<this, string>(this);
  private _notebooks: INotebookTracker | null;

  constructor(options: IOutsourceror.IOptions) {
    this._notebooks = options.notebooks || null;
    this._ready.resolve(void 0);
  }

  get ready() {
    return this._ready.promise;
  }

  get executeRequested() {
    return this._executeRequested;
  }

  get widgetRequested() {
    return this._widgetRequested;
  }

  requestWidget(factoryName: string) {
    this._widgetRequested.emit(factoryName);
  }

  get factoryRegistered() {
    return this._factoryRegistered;
  }

  get isMarkdownCell() {
    if (this._notebooks == null) {
      return false;
    }
    const { activeCell } = this._notebooks;
    return activeCell instanceof MarkdownCell;
  }

  get isCodeCell() {
    if (this._notebooks == null) {
      return false;
    }
    const { activeCell } = this._notebooks;
    return activeCell instanceof CodeCell;
  }

  register(factory: IOutsourceror.IFactory) {
    Private.register(factory);
    this._factoryRegistered.emit(factory);
    return factory;
  }

  get factories() {
    return Array.from(Private.factories());
  }

  factory(id: string) {
    return Private.factory(id) || null;
  }

  execute(cell: ICellModel) {
    this._executeRequested.emit(cell);
  }
}

namespace Private {
  const _factories = new Map<string, IOutsourceror.IFactory>();

  export function register(factory: IOutsourceror.IFactory): void {
    _factories.set(factory.id, factory);
  }

  export function factory(id: string) {
    return _factories.get(id);
  }

  export function factories() {
    return _factories.values();
  }
}
