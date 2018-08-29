import {PromiseDelegate} from '@phosphor/coreutils';
import {Signal} from '@phosphor/signaling';
import {INotebookTracker} from '@jupyterlab/notebook';
import {MarkdownCell, CodeCell} from '@jupyterlab/cells';

import {IOutsourcerer, IOutsourcererOptions, IOutsourceFactory} from '.';

export class Sourcerer implements IOutsourcerer {
  private _ready = new PromiseDelegate<void>();
  private _factoryRegistered = new Signal<this, IOutsourceFactory>(this);
  private _notebooks: INotebookTracker;

  constructor(options: IOutsourcererOptions) {
    this._notebooks = options.notebooks;
    this._ready.resolve(void 0);
  }

  get ready() {
    return this._ready.promise;
  }

  get factoryRegistered() {
    return this._factoryRegistered;
  }

  get isMarkdownCell() {
    const {activeCell} = this._notebooks;
    return activeCell instanceof MarkdownCell;
  }

  get isCodeCell() {
    const {activeCell} = this._notebooks;
    return activeCell instanceof CodeCell;
  }

  register(factory: IOutsourceFactory) {
    Private.register(factory);
    this._factoryRegistered.emit(factory);
    return factory;
  }
}

namespace Private {
  const factories = new Map<string, IOutsourceFactory>();

  export function register(factory: IOutsourceFactory): void {
    factories.set(factory.id, factory);
  }
}
