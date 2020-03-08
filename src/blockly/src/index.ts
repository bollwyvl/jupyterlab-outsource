import { Token } from '@lumino/coreutils';

export const PLUGIN_ID = '@deathbeds/jupyterlab-outsource:blockly';

export const IOutsourceBlockly = new Token<IOutsourceBlockly>(PLUGIN_ID);

export interface IOutsourceBlockly {}

const NS = 'jp-Outsource-Blockly';

export const CSS = {
  OUTER_WRAPPER: NS,
  WRAPPER: `${NS}-wrapper`
};

export interface IBlocklyMetadata {
  workspace?: string;
  toolbox?: string;
}

export const START_BLOCKLY = {
  python: '# start blockly'
};

export const END_BLOCKLY = {
  python: '# end blockly'
};
