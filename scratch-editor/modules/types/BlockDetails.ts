interface Inputs {
  [key: string]:
    | [number, string, string]
    | [number, [number, string]]
    | [number, string, [number, string]]
    | [number, string];
}

interface Field {
  [key: string]: [string, null];
}

interface BlockParameter {
  parameterName: string;
  parameterArrayNumber: number;
  parameterValue: any;
  menuBlockOpcode?: string;
  parameterType: "parameter" | "menu" | "dropdown";
}

interface BlockDetails {
  opcode: string;
  blockParameters: BlockParameter[];
  x?: number;
  y?: number;
  topLevel: boolean;
}

export { BlockDetails, Inputs, Field };
