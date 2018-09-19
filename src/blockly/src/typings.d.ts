declare module 'node-blockly/browser' {
  export interface IWorkspace {
    addChangeListener(callback: Function): void;
  }
  export interface ILanguage {
    workspaceToCode(workspace: IWorkspace): string;
  }
  export interface IInjectOptions {
    toolbox?: HTMLElement | string;
  }

  export interface IBlockly {
    inject(node: HTMLElement, opts?: IInjectOptions): IWorkspace;
    Python: ILanguage;
  }
  const blocklyStatic: IBlockly;
  export default blocklyStatic;
}
