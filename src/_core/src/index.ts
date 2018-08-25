import {Token} from '@phosphor/coreutils';
import {Widget} from '@phosphor/widgets';
import {ISignal} from '@phosphor/signaling';

import {ICellModel} from '@jupyterlab/cells';

export const PLUGIN_ID = '@deathbeds/jupyterlab-outsource';

/* tslint:disable */
/**
 * The notebook source manager
 */
export const IOutsourcerer = new Token<IOutsourcerer>(PLUGIN_ID);
/* tslint:enable */

export interface IOutsourcerer {
  ready: Promise<void>;
  register(factory: IOutsourceFactory): IOutsourceFactory;
  factoryRegistered: ISignal<IOutsourcerer, IOutsourceFactory>;
}

export interface IOutsourceFactory {
  readonly name: string;
  readonly iconClass: string;
  readonly id: string;
  createWidget(options: IOutsourceFactoryOptions): Promise<Widget>;
}

export interface IOutsourceFactoryOptions {
  // FIXME: probably some other upstream model
  model: ICellModel;
}
