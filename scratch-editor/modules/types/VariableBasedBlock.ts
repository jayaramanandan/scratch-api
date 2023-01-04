interface BlockInputFieldValues {
  inputFieldName: string;
  values: any[];
  parameterValue: Function | any;
}

interface VariableBasedBlock {
  mainBlockOpcode: string;
  inputValues: BlockInputFieldValues[];
  fieldValues: BlockInputFieldValues[];
}

export { VariableBasedBlock, BlockInputFieldValues };
