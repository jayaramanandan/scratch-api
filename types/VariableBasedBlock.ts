interface BlockInputFieldValues {
  inputFieldName: string;
  values: any[];
  parameterValue: string | number | Function;
}

interface VariableBasedBlock {
  mainBlockOpcode: string;
  inputValues: BlockInputFieldValues[];
  fieldValues: BlockInputFieldValues[];
}

export default VariableBasedBlock;
