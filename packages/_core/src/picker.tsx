import React from 'react';

import { IOutsourceror } from '.';

import { VDomModel, VDomRenderer } from '@jupyterlab/apputils';

export class OutsourcePicker extends VDomRenderer<OutsourcePicker.Model> {
  constructor(options: OutsourcePicker.IOptions) {
    super(new OutsourcePicker.Model(options));
  }

  protected render(): React.ReactElement<any> {
    let m = this.model;

    // Bail if there is no model.
    if (!m || !m.sourceror) {
      return <span />;
    }

    return (
      <select
        className="jp-mod-styled jp-Outsource-Picker"
        value={m.value}
        onChange={this.onChange}
      >
        <option value="" />
        {m.sourceror.factories.map(({ name, id }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    );
  }

  onChange = (evt: React.FormEvent<any>) => {
    const { value } = evt.currentTarget;
    if (value == null) {
      return;
    }
    this.model.sourceror.requestWidget({
      factory: value,
      path: this.model.path
    });
    this.model.value = '';
  };
}

export namespace OutsourcePicker {
  export interface IOptions {
    sourceror: IOutsourceror;
    path: string;
  }

  export class Model extends VDomModel {
    private _sourceror: IOutsourceror;
    private _value: string = '';
    private _path: string = '';

    constructor(options: IOptions) {
      super();
      this._sourceror = options.sourceror;
      this._path = options.path;
    }

    get value() {
      return this._value;
    }

    set value(value: string) {
      this._value = value;
      this.stateChanged.emit(void 0);
    }

    get path() {
      return this._path;
    }

    set path(path) {
      this._path = path;
      this.stateChanged.emit(void 0);
    }

    get sourceror() {
      return this._sourceror;
    }

    set sourceror(sourceror: IOutsourceror) {
      this._sourceror = sourceror;
      sourceror.factoryRegistered.connect(() => this.stateChanged.emit(void 0));
      this.stateChanged.emit(void 0);
    }
  }
}
