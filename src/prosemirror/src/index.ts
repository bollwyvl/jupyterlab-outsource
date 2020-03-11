import { Token } from '@lumino/coreutils';
import { EditorProps } from 'prosemirror-view';
import { Plugin } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';

import { IOutsourceror } from '@deathbeds/jupyterlab-outsource/src';

export const PLUGIN_ID = '@deathbeds/jupyterlab-outsource:prosemirror';

export const IOutsourceProsemirror = new Token<IOutsourceProsemirror>(PLUGIN_ID);

export interface IOutsourceProsemirror extends IOutsourceror.IFactory {
  addExtension(name: string, extension: IOutsourceProsemirror.IExtension): void;
  getExtensions(): IOutsourceProsemirror.IExtend[];
}

export namespace IOutsourceProsemirror {
  export interface IFactoryOptions extends IOutsourceror.IFactoryOptions {
    factory: IOutsourceProsemirror;
    schema: Schema;
  }
  export interface IExtension {
    init(): Promise<IExtend>;
  }
  export interface IExtend {
    (schema: Schema): IExtensionPoints;
  }
  export interface IExtensionPoints {
    nodes?: Partial<Schema['nodes']>;
    nodeViews?: EditorProps['nodeViews'];
    plugins?: Plugin[];
  }
}

export const CSS = {
  OUTER_WRAPPER: `jp-Outsource-ProseMirror`,
  WRAPPER: `jp-Outsource-ProseMirror-wrapper`,
};
