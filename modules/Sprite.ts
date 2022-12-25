import { createHash } from "crypto";
import { Block } from "../types/ProjectEditorPayload";
import SimpleBlock from "../types/SimpleBlock";
import VariableBasedBlock from "../types/VariableBasedBlock";

class Sprite {
  public blocks: any = {};
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
  private spriteHash: string;
  private blocksCount: number = 0;

  constructor(public name: string, private costumeImageFileName?: string) {
    this.spriteHash = createHash("sha256").update(name).digest("base64");
  }

  private getBlockId(
    blockCountsAway: number,
    isVariableBlock?: boolean
  ): string {
    return `${isVariableBlock && isVariableBlock == true && "variableBlock-"}${
      this.spriteHash
    }${this.blocksCount + blockCountsAway}`;
  }

  private addBlock(block: Block): void {
    const blockId: string = this.spriteHash + this.blocksCount;
    this.blocks[blockId] = block;
    this.blocksCount++;
  }

  private addSimpleBlock({
    opcode,
    fields,
    inputs,
    topLevel,
  }: SimpleBlock): void {
    const blockId: string = this.spriteHash + this.blocksCount;
    const previousBlockId: string = `${this.spriteHash}${this.blocksCount - 1}`;
    const previousBlock: Block = this.blocks[previousBlockId];

    const saveBlock: Block = {
      opcode,
      fields,
      inputs,
      topLevel,
      next: null,
      parent: previousBlockId,
      shadow: false,
      x: previousBlock && previousBlock.topLevel ? 0 : undefined,
      y: previousBlock && previousBlock.topLevel ? 0 : undefined,
    };

    if (previousBlock) this.blocks[previousBlockId].next = blockId;

    this.blocks[blockId] = saveBlock;
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

  private addVariableBasedBlock({
    mainBlockOpcode,
    inputValues,
    fieldValues,
  }: VariableBasedBlock) {
    let inputs: any = {};
    let fields: any = {};

    for (
      let i: number = 0;
      i <
      (inputValues.length > fieldValues.length
        ? inputValues.length
        : fieldValues.length);
      i++
    ) {
      console.log(fieldValues[i].parameterValue);
      if (inputValues[i]) {
        inputs[inputValues[i].inputFieldName] =
          typeof fieldValues[i].parameterValue == "function"
            ? inputValues[i].values[1]
            : inputValues[i].values[0];
        this.blocks[this.getBlockId(0, true) + `${i}`] = {
          opcode:
            typeof fieldValues[i].parameterValue == "function"
              ? fieldValues[i].parameterValue() //fix this
              : fieldValues[i].parameterValue,
          inputs: {},
          fields: {},
          next: null,
          parent: this.getBlockId(0),
          shadow: false,
          topLevel: false,
        };
      }
      if (fieldValues[i]) {
        inputs[fieldValues[i].inputFieldName] =
          typeof fieldValues[i].parameterValue == "function"
            ? fieldValues[i].values[1]
            : fieldValues[i].values[0];
      }
    }

    this.blocks[this.getBlockId(-1)].next = this.getBlockId(0);

    this.blocks[this.getBlockId(0)] = {
      opcode: mainBlockOpcode,
      inputs,
      fields,
      parent: this.getBlockId(-1),
      next: null,
      shadow: false,
      topLevel: false,
    };

    this.blocksCount++;
  }

  public whenGreenFlagClicked(): void {
    this.addSimpleBlock({
      opcode: "event_whenflagclicked",
      fields: {},
      inputs: {},
      topLevel: true,
    });
  }

  public moveSteps(steps: number | Function): void {
    this.addVariableBasedBlock({
      mainBlockOpcode: "motion_movesteps",
      inputValues: [
        {
          inputFieldName: "STEPS",
          parameterValue: steps,
          values: [
            [1, [4, `${steps}`]],
            [3, this.getBlockId(0, true) + "0", [4, "10"]],
          ],
        },
      ],
      fieldValues: [],
    });
  }

  public turnDegrees(
    direction: "right" | "left",
    degrees: number | Function
  ): void {
    this.addSimpleBlock({
      opcode: `motion_turn${direction}`,
      inputs: {
        DEGREES:
          typeof degrees == "number"
            ? [1, [4, `${degrees}`]]
            : [3, `${this.spriteHash}${this.blocksCount + 1}`, [4, "15"]],
      },
      fields: {},
      topLevel: false,
    });

    this.addVariableBasedBlock({
      mainBlockOpcode: `motion_turn${direction}`,
      inputValues: [
        {
          inputFieldName: "DEGREES",
          values: [
            [1, [4, `${degrees}`]],
            [3, "variableBlock-" + this.getBlockId(0), [4, "10"]],
          ],
          parameterValue: degrees,
        },
      ],
      fieldValues: [],
    });
  }

  public goToCoordinates(x: number | Function, y: number | Function): void {
    this.addSimpleBlock({
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
    this.addSimpleBlock({
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
    this.addSimpleBlock({
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
    this.addSimpleBlock({
      opcode: "motion_glideto",
      inputs: {
        SECS: [1, [4, `${seconds}`]],
        TO: [1, `${this.spriteHash}${this.blocksCount + 1}`],
      },
      fields: {},
      topLevel: false,
    }); //adds main block

    this.addMenuBlock({
      opcode: "motion_glideto_menu",
      inputs: {},
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

  public pointInDirection(degrees: number): void {
    if (degrees < -90 || degrees > 180)
      throw new Error(
        "pointInDirection function takes degrees argument to be between -90 and 180 only"
      );

    this.addSimpleBlock({
      opcode: "motion_pointindirection",
      inputs: {
        DIRECTION: [1, [8, `${degrees}`]],
      },
      fields: {},
      topLevel: false,
    });
  }

  public pointTowards(location: "mouse" | Sprite): void {
    this.addSimpleBlock({
      opcode: "motion_pointtowards",
      inputs: {
        TOWARDS: [1, `${this.spriteHash}${this.blocksCount + 1}`],
      },
      fields: {},
      topLevel: false,
    }); //adds main block

    this.addMenuBlock({
      opcode: "motion_pointtowards_menu",
      inputs: {},
      fields: {
        TOWARDS: [
          location == "mouse" ? `_${location}_` : location.name,
          ,
          null,
        ],
      },
      topLevel: false,
    }); //adds dropdown
  }

  public changeXBy(x: number): void {
    this.addSimpleBlock({
      opcode: "motion_changexby",
      inputs: {
        DX: [1, [4, `${x}`]],
      },
      fields: {},
      topLevel: false,
    });
  }

  public changeYBy(y: number): void {
    this.addSimpleBlock({
      opcode: "motion_changeyby",
      inputs: {
        DY: [1, [4, `${y}`]],
      },
      fields: {},
      topLevel: false,
    });
  }

  public setXTo(x: number): void {
    this.addSimpleBlock({
      opcode: "motion_setx",
      inputs: {
        X: [1, [4, `${x}`]],
      },
      fields: {},
      topLevel: false,
    });
  }

  public setYTo(y: number): void {
    this.addSimpleBlock({
      opcode: "motion_sety",
      inputs: {
        Y: [1, [4, `${y}`]],
      },
      fields: {},
      topLevel: false,
    });
  }

  public ifOnEdgeBounce(): void {
    this.addSimpleBlock({
      opcode: "motion_ifonedgebounce",
      inputs: {},
      fields: {},
      topLevel: false,
    });
  }

  public setRotationStyle(
    style: "left-right" | "don't rotate" | "all around"
  ): void {
    this.addSimpleBlock({
      opcode: "motion_setrotationstyle",
      inputs: {},
      fields: {
        STYLE: [style, null],
      },
      topLevel: false,
    });
  }

  public getXPosition(): string {
    return "motion_xposition";
  }

  public getYPosition(): string {
    return "motion_yposition";
  }
}

export default Sprite;
