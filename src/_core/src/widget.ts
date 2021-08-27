import { Widget } from '@lumino/widgets';
import { IOutsourceror } from '.';

export class Outsource extends Widget implements IOutsourceror.IOutsource {
  protected _path: string;
  protected _factory: IOutsourceror.IFactory;

  constructor(options: IOutsourceror.IWidgetOptions) {
    super();
    this._path = options.path;
    this._factory = options.factory;
  }

  get path() {
    return this._path;
  }

  get factory() {
    return this._factory;
  }
}
