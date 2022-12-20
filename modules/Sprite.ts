import { createHash } from "crypto";
import { Block } from "../types/ProjectEditorPayload";

class Sprite {
  private blocks: any;
  private previousBlockId: string = "";
  private spriteHash: string;
  private blocksCount: number = 0;

  constructor(private name: string, private costumeImageFileName?: string) {
    this.spriteHash = createHash("sha256").update(name).digest("base64");
  }

  private addBlock(block: Block): void {
    this.blocks[this.spriteHash + this.blocksCount] = block;
    this.blocksCount++;
  }

  public whenGreenFlagClicked(): void {
    this.addBlock({opcode:"event_whenflagclicked", fields:{}, inputs:{}, next:) //do this
  }
}

export default Sprite;
