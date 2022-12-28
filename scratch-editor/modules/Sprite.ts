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

export { Sprite, Costume };
