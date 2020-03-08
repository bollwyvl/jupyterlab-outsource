import { Token } from '@lumino/coreutils';

export const PLUGIN_ID = '@deathbeds/jupyterlab-outsource:prosemirror';

export const IOutsourceProsemirror = new Token<IOutsourceProsemirror>(PLUGIN_ID);

export interface IOutsourceProsemirror {}

export const CSS = {
  OUTER_WRAPPER: `jp-Outsource-ProseMirror`,
  WRAPPER: `jp-Outsource-ProseMirror-wrapper`
};
