import {PromiseDelegate} from '@phosphor/coreutils';
import {Signal} from '@phosphor/signaling';

import {IOutsourcerer, IOutsourceFactory} from '.';

export class Sourcerer implements IOutsourcerer {
  private _ready = new PromiseDelegate<void>();
  private _factoryRegistered = new Signal<this, IOutsourceFactory>(this);

  constructor() {
    this._ready.resolve(void 0);
  }

  get ready() {
    return this._ready.promise;
  }

  get factoryRegistered() {
    return this._factoryRegistered;
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
