import Sprite from "../../scratch-editor/types/Sprite";

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

interface ProjectEditorPayload {
  extensions: string[];
  meta: Meta;
  monitors: Monitor[];
  targets: Sprite[];
}

export default ProjectEditorPayload;
