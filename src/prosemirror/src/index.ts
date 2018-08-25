import {Token} from '@phosphor/coreutils';

export const PLUGIN_ID = '@deathbeds/jupyterlab-outsource:prosemirror';

/* tslint:disable */
/**
 * The notebook source manager
 */
export const IOutsourceProsemirror = new Token<IOutsourceProsemirror>(PLUGIN_ID);
/* tslint:enable */

export interface IOutsourceProsemirror {
  ready: Promise<void>;
}
