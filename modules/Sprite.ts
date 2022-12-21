import { createHash } from "crypto";
import { Block } from "../types/ProjectEditorPayload";
import SimpleBlock from "../types/SimpleBlock";

class Sprite {
  private blocks: any = {};
  private previousBlock: { id: string | null; block: Block } = {
    id: null,
    block: {
      opcode: "event_whenflagclicked",
      fields: {},
      inputs: {},
      next: null,
      parent: null,
      shadow: false,
      topLevel: true,
      x: 0,
      y: 0,
    },
  }; //default starting block
  private spriteVariables: any = {};
  private spriteHash: string;
  private blocksCount: number = 0;

  constructor(private name: string, private costumeImageFileName?: string) {
    this.spriteHash = createHash("sha256").update(name).digest("base64");
  }

  private addBlock({ opcode, fields, inputs, topLevel }: SimpleBlock): void {
    const blockId: string = this.spriteHash + this.blocksCount;
    const saveBlock: Block = {
      opcode,
      fields,
      inputs,
      topLevel,
      next: null,
      parent: this.previousBlock.id,
      shadow: false,
      x: this.previousBlock.block.topLevel ? 0 : undefined,
      y: this.previousBlock.block.topLevel ? 0 : undefined,
    };

    if (this.previousBlock.id)
      this.blocks[this.previousBlock.id].next = blockId;

    this.blocks[blockId] = saveBlock;
    this.previousBlock = { id: blockId, block: saveBlock };
    this.blocksCount++;
  }

  private addMenuBlock({
    opcode,
    fields,
    inputs,
    topLevel,
  }: SimpleBlock): void {
    this.blocks[this.spriteHash + this.blocksCount] = {
      opcode,
      next: null,
      parent: `${this.spriteHash}${this.blocksCount - 1}`,
      inputs,
      fields,
      shadow: true,
      topLevel,
    }; //adds menu

    this.blocksCount++;
  }

  public whenGreenFlagClicked(): void {
    this.addBlock({
      opcode: "event_whenflagclicked",
      fields: {},
      inputs: {},
      topLevel: true,
    });
  }

  public moveSteps(steps: number): void {
    this.addBlock({
      opcode: "motion_movesteps",
      inputs: {
        STEPS: [1, [4, `${steps}`]],
      },
      fields: {},
      topLevel: false,
    });
  }

  public turnDegrees(direction: "right" | "left", degrees: number): void {
    this.addBlock({
      opcode: `motion_turn${direction}`,
      inputs: {
        DEGREES: [1, [4, `${degrees}`]],
      },
      fields: {},
      topLevel: false,
    });
  }

  public goToCoordinates(x: number, y: number): void {
    this.addBlock({
      opcode: "motion_gotoxy",
      inputs: {
        X: [1, [4, `${x}`]],
        Y: [1, [4, `${y}`]],
      },
      fields: {},
      topLevel: false,
    });
  }

  public goToLocation(location: "random" | "mouse" | Sprite): void {
    this.addBlock({
      opcode: "motion_goto",
      inputs: {
        TO: [1, `${this.spriteHash}${this.blocksCount + 1}`],
      },
      fields: {},
      topLevel: false,
    }); //adds main block

    this.addMenuBlock({
      opcode: "motion_goto_menu",
      inputs:
        location == "random" || location == "mouse"
          ? {}
          : {
              TO: [1, `${this.spriteHash}${this.blocksCount + 1}`],
            },
      fields: {
        TO: [
          location == "random" || location == "mouse"
            ? `_${location}_`
            : location.name,
          null,
        ],
      },
      topLevel: false,
    }); //adds dropdown
  }

  public glideToCoordinates(x: number, y: number, seconds: number): void {
    this.addBlock({
      opcode: "motion_glidesecstoxy",
      inputs: {
        SECS: [1, [4, `${seconds}`]],
        X: [1, [4, `${x}`]],
        Y: [1, [4, `${y}`]],
      },
      fields: {},
      topLevel: false,
    });
  }

  public glideToLocation(
    location: "random" | "mouse" | Sprite,
    seconds: number
  ): void {
    this.addBlock({
      opcode: "motion_glideto",
      inputs: {
        TO: [1, `${this.spriteHash}${this.blocksCount + 1}`],
      },
      fields: {},
      topLevel: false,
    }); //adds main block

    this.addMenuBlock({
      opcode: "motion_goto_menu",
      inputs:
        location == "random" || location == "mouse"
          ? {}
          : {
              SECS: [1, [4, `${seconds}`]],
              TO: [1, `${this.spriteHash}${this.blocksCount - 1}`],
            },
      fields: {
        TO: [
          location == "random" || location == "mouse"
            ? `_${location}_`
            : location.name,
          null,
        ],
      },
      topLevel: false,
    }); //adds dropdown
  }
}

export default Sprite;
