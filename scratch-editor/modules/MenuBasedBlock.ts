import {
  VariableBasedBlock,
  BlockInputFieldValues,
} from "./VariableBasedBlock";

interface MenuBasedBlock extends VariableBasedBlock {
  menuBlockOpcode: string;
  menuFields: any;
  topLevel: boolean;
}

export default MenuBasedBlock;
