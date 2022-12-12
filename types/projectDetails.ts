interface ProjectGeneralDetails {
  id: number;
  title: string;
  description: string;
  instructions: string;
  visibility: string;
  public: boolean;
  comments_allowed: boolean;
  is_published: boolean;
  author: {
    id: number;
    username: string;
    scratchteam: boolean;
    history: any;
    profile: { id: number; images: any[] };
  };
  image: string;
  images: any;
  history: {
    created: string;
    modified: string;
    shared: string;
  };
  stats: { views: number; loves: number; favorites: number; remixes: number };
  remix: { parent: any; root: any };
  project_token: string;
}

interface Target {
  isStage: boolean;
  name: string;
  variables: any;
  lists: any;
  broadcasts: any;
  blocks: any[];
  comments: any;
  currentCostume: number;
  costumes: Array<any>[];
  sounds: Array<any>[];
  volume: number;
  layerOrder: number;
  visible?: boolean;
  x?: number;
  y?: number;
  size?: number;
  direction?: number;
  draggable?: boolean;
  rotationStyle?: string;
}

interface Monitor {
  id: string;
  mode: string;
  opcode: string;
  params: any[];
  spriteName: any;
  value: number;
  width: number;
  height: number;
  x: 5;
  y: 5;
  visible: true;
  sliderMin: number;
  sliderMax: number;
  isDiscrete: boolean;
}

interface ProjectEditorDetails {
  targets: Target[];
  monitors: Monitor[];
  extensions: string[];
  meta: {
    semver: string;
    vm: string;
    agent: string;
  };
}

interface ProjectDetails {
  projectGeneralDetails: ProjectGeneralDetails;
  projectEditorDetails: ProjectEditorDetails;
}

export { ProjectGeneralDetails, ProjectEditorDetails, ProjectDetails };
