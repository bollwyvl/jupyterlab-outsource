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


export interface ILangugeGenerator {
  [key: string]: (block: any) => [string, number] | string;
}

// tslint:disable
const ROBOT_BLOCKS = require('../blocks/robot/stdlibs.json') as IBlockCollection;
// tslint:enable

let blocks: IBlockJSON[] = [];

function unquote(value: string) {
  return value.replace(/^['"]?(.*?)['"]?$/, '$1');
}

function makeKeywordHandler(blockId: string, blockDef: IBlock) {
  if (_Python[blockId]) {
    return;
  }
  _Python[blockId] = (block: any) => {
    let args: string[] = [];
    for (let arg of blockDef.args) {
      let val = Blockly.Python.valueToCode(block, arg, 0);
      if (val) {
        args.push(unquote(val));
      }
    }
    let code = `${blockDef.name}  ${args.join('    ')}`.trim();
    return `${code}\n`;
  };
}

let _Python: ILangugeGenerator = Blockly.Python as any;

// Things we know
_Python.robot___test__case = (block) => {
  let name = unquote(Blockly.Python.valueToCode(block, 'NAME', 0));
  let rows = Blockly.Python.statementToCode(block, 'ROWS');
  return `*** Test Case ***\n${name}\n${rows}`;
};

// Things we know
_Python.robot___task = (block) => {
  let name = unquote(Blockly.Python.valueToCode(block, 'NAME', 0));
  let rows = Blockly.Python.statementToCode(block, 'ROWS');
  return `*** Task ***\n${name}\n${rows}`;
};

_Python.robot___keyword = (block) => {
  let name = unquote(Blockly.Python.valueToCode(block, 'NAME', 0));
  let rows = Blockly.Python.statementToCode(block, 'ROWS');
  return `*** Keyword ***\n${name}\n${rows}`;
};

_Python.robot___settings = (block) => {
  let rows = Blockly.Python.statementToCode(block, 'ROWS').replace(/^    /gm, '');
  return `*** Settings ***\n${rows}`;
};

for (let libId in ROBOT_BLOCKS) {
  for (let blockId in ROBOT_BLOCKS[libId]) {
    let block = ROBOT_BLOCKS[libId][blockId];
    console.log(block.block);
    blocks.push(block.block);
    makeKeywordHandler(blockId, block);
  }
}

Blockly.defineBlocksWithJsonArray(blocks);
