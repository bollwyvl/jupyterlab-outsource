import {Token} from '@phosphor/coreutils';

export const PLUGIN_ID = '@deathbeds/jupyterlab-outsource';

/* tslint:disable */
/**
 * The notebook source manager
 */
export const IOutsourcerer = new Token<IOutsourcerer>(PLUGIN_ID);
/* tslint:enable */

export interface IOutsourcerer {
  ready: Promise<void>;
}
