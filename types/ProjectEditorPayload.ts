interface Meta {
  agent: string;
  semver: string;
  vm: string;
}

interface Monitor {
  id: string;
  mode: string;
  opcode: string;
  params: any;
  spriteName: string;
  value: any[];
  width: number;
  height: number;
  x: number;
  y: number;
  visible: boolean;
}

interface Costume {
  assetId: string;
  dataFormat: string;
  md5ext: string;
  name: string;
  rotationCenterX: number;
  rotationCenterY: number;
}
interface Sound {
  assetId: string;
  dataFormat: string;
  format: string;
  md5ext: string;
  name: string;
  rate: number;
  sampleCount: number;
}
interface Block {
  opcode: string;
  next: string | null;
  parent: string | null;
  inputs: any;
  fields: any;
  shadow: boolean;
  topLevel: boolean;
  x?: number;
  y?: number;
}
interface Sprite {
  blocks: any;
  broadcasts: any;
  comments: any;
  costumes: Costume[];
  currentCostume: number;
  isStage: boolean;
  layerOrder: number;
  lists: any;
  name: string;
  sounds: Sound[];
  tempo?: number;
  textToSpeechLanguage: string;
  variables: any;
  videoState?: string;
  videoTransparency?: number;
  x: number;
  y: number;
  size: number;
  direction: number;
  draggable: boolean;
  rotationStyle: string;
  volume: number;
}

interface ProjectEditorPayload {
  extensions: string[];
  meta: Meta;
  monitors: Monitor[];
  targets: Sprite[];
}

export { ProjectEditorPayload, Block };
