import SimpleBlock from "./SimpleBlock";

interface Block extends SimpleBlock {
  next: string | null;
  parent: string | null;
  shadow: boolean;
  x?: number;
  y?: number;
}

export default Block;
