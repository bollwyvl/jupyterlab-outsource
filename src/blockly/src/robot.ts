import Blockly, {IBlockJSON} from 'node-blockly/browser';

export interface IBlock {
  block: IBlockJSON;
  template: string;
  args: string[];
  name: string;
}

export interface IBlocks {
  [key: string]: IBlock;
}

export interface IBlockCollection {
  [key: string]: IBlocks;
}

// TODO: this should be it's own package

// tslint:disable
const ROBOT_BLOCKS = require('../blocks/robot/stdlibs.json') as IBlockCollection;
// tslint:enable

let blocks: IBlockJSON[] = [];

export interface ILangugeGenerator {
  [key: string]: (block: any) => [string, number] | string;
}

let _Python: ILangugeGenerator = Blockly.Python as any;

for (let libId in ROBOT_BLOCKS) {
  for (let blockId in ROBOT_BLOCKS[libId]) {
    let block = ROBOT_BLOCKS[libId][blockId];
    blocks.push(block.block);
    makeKeywordHandler(blockId, block);
  }
}

function makeKeywordHandler(blockId: string, blockDef: IBlock) {
  _Python[blockId] = (block: any) => {
    let args: string[] = [];
    for (let arg of blockDef.args) {
      let val = Blockly.Python.valueToCode(block, arg, 0);
      if (val) {
        args.push(val.replace(/^['"]?(.*?)['"]?$/, '$1'));
      }
    }
    let code = `${blockDef.name}  ${args.join('    ')}`.trim();
    return `${code}\n`;
  };
}

Blockly.defineBlocksWithJsonArray(blocks);

console.log('DEFINED', blocks.length, 'BLOCKS');
