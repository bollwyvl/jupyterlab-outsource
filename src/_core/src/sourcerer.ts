import {PromiseDelegate} from '@phosphor/coreutils';

import {IOutsourcerer} from '.';

export class Sourcerer implements IOutsourcerer {
  private _ready = new PromiseDelegate<void>();

  constructor() {
    this._ready.resolve(void 0);
  }

  get ready() {
    return this._ready.promise;
  }
}
