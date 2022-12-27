import { createHash } from "crypto";
import Block from "./types/Block";
import SimpleBlock from "./types/SimpleBlock";
import VariableBasedBlock from "./types/VariableBasedBlock";

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
    return `${isVariableBlock ? "variableBlock-" : ""}${this.spriteHash}${
      this.blocksCount + blockCountsAway
    }`;
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
    this.blocks[this.getBlockId(0)] = {
      opcode,
      next: null,
      parent: this.getBlockId(-1),
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
      if (inputValues[i]) {
        inputs[inputValues[i].inputFieldName] =
          typeof inputValues[i].parameterValue == "function"
            ? inputValues[i].values[1]
            : inputValues[i].values[0];

        if (typeof inputValues[i].parameterValue == "function") {
          this.blocks[this.getBlockId(0, true) + `${i}`] = {
            opcode:
              typeof inputValues[i].parameterValue == "function"
                ? inputValues[i].parameterValue()
                : inputValues[i].parameterValue,
            inputs: {},
            fields: {},
            next: null,
            parent: this.getBlockId(0),
            shadow: false,
            topLevel: false,
          };
        }
      }

      if (fieldValues[i]) {
        inputs[fieldValues[i].inputFieldName] =
          typeof fieldValues[i].parameterValue == "function"
            ? fieldValues[i].values[1]
            : fieldValues[i].values[0];

        if (typeof fieldValues[i].parameterValue == "function") {
          this.blocks[this.getBlockId(0, true) + `${i}`] = {
            opcode:
              typeof fieldValues[i].parameterValue == "function"
                ? fieldValues[i].parameterValue()
                : fieldValues[i].parameterValue,
            inputs: {},
            fields: {},
            next: null,
            parent: this.getBlockId(0),
            shadow: false,
            topLevel: false,
          };
        }
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
    this.addVariableBasedBlock({
      mainBlockOpcode: `motion_turn${direction}`,
      inputValues: [
        {
          inputFieldName: "DEGREES",
          values: [
            [1, [4, `${degrees}`]],
            [3, this.getBlockId(0, true) + "0", [4, "0"]],
          ],
          parameterValue: degrees,
        },
      ],
      fieldValues: [],
    });
  }

  public goToCoordinates(x: number | Function, y: number | Function): void {
    this.addVariableBasedBlock({
      mainBlockOpcode: "motion_gotoxy",
      inputValues: [
        {
          inputFieldName: "X",
          values: [
            [1, [4, `${x}`]],
            [3, this.getBlockId(0, true) + "0", [4, "10"]],
          ],
          parameterValue: x,
        },
        {
          inputFieldName: "Y",
          values: [
            [1, [4, `${y}`]],
            [3, this.getBlockId(0, true) + "1", [4, "10"]],
          ],
          parameterValue: y,
        },
      ],
      fieldValues: [],
    });
  }

  public goToLocation(location: "random" | "mouse" | Sprite): void {
    this.addSimpleBlock({
      opcode: "motion_goto",
      inputs: {
        TO: [1, this.getBlockId(1)],
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
              TO: [1, this.getBlockId(1)],
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

  public glideToCoordinates(
    seconds: number | Function,
    x: number | Function,
    y: number | Function
  ): void {
    this.addVariableBasedBlock({
      mainBlockOpcode: "motion_glidesecstoxy",
      inputValues: [
        {
          inputFieldName: "SECS",
          values: [
            [1, [4, `${seconds}`]],
            [3, this.getBlockId(0, true) + "0", [4, "1"]],
          ],
          parameterValue: seconds,
        },
        {
          inputFieldName: "X",
          values: [
            [1, [4, `${x}`]],
            [3, this.getBlockId(0, true) + "1", [4, "1"]],
          ],
          parameterValue: x,
        },
        {
          inputFieldName: "Y",
          values: [
            [1, [4, `${y}`]],
            [3, this.getBlockId(0, true) + "2", [4, "1"]],
          ],
          parameterValue: y,
        },
      ],
      fieldValues: [],
    });
  }

  public glideToLocation(
    seconds: number | Function,
    location: "random" | "mouse" | Sprite
  ): void {
    this.addVariableBasedBlock({
      mainBlockOpcode: "motion_glideto",
      inputValues: [
        {
          inputFieldName: "SECS",
          values: [
            [1, [4, `${seconds}`]],
            [3, this.getBlockId(0, true) + "0", [4, "1"]],
          ],
          parameterValue: seconds,
        },
        {
          inputFieldName: "TO",
          values: [
            [1, this.getBlockId(1)],
            [1, this.getBlockId(1)],
          ],
          parameterValue: null,
        },
      ],
      fieldValues: [],
    });

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

  public pointInDirection(degrees: number | Function): void {
    if (degrees < -90 || degrees > 180)
      throw new Error(
        "pointInDirection function takes degrees argument to be between -90 and 180 only"
      );

    this.addVariableBasedBlock({
      mainBlockOpcode: "motion_pointindirection",
      inputValues: [
        {
          inputFieldName: "DIRECTION",
          values: [
            [1, [4, `${degrees}`]],
            [3, this.getBlockId(0, true) + "0", [4, "1"]],
          ],
          parameterValue: degrees,
        },
      ],
      fieldValues: [],
    });
  }

  public pointTowards(location: "mouse" | Sprite): void {
    this.addSimpleBlock({
      opcode: "motion_pointtowards",
      inputs: {
        TOWARDS: [1, this.getBlockId(1)],
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

  public changeXBy(x: number | Function): void {
    this.addVariableBasedBlock({
      mainBlockOpcode: "motion_changexby",
      inputValues: [
        {
          inputFieldName: "DX",
          values: [
            [1, [4, `${x}`]],
            [3, this.getBlockId(0, true) + "0", [4, "1"]],
          ],
          parameterValue: x,
        },
      ],
      fieldValues: [],
    });
  }

  public changeYBy(y: number | Function): void {
    this.addVariableBasedBlock({
      mainBlockOpcode: "motion_changeyby",
      inputValues: [
        {
          inputFieldName: "DY",
          values: [
            [1, [4, `${y}`]],
            [3, this.getBlockId(0, true) + "0", [4, "1"]],
          ],
          parameterValue: y,
        },
      ],
      fieldValues: [],
    });
  }

  public setXTo(x: number | Function): void {
    this.addVariableBasedBlock({
      mainBlockOpcode: "motion_setx",
      inputValues: [
        {
          inputFieldName: "X",
          values: [
            [1, [4, `${x}`]],
            [3, this.getBlockId(0, true) + "0", [4, "1"]],
          ],
          parameterValue: x,
        },
      ],
      fieldValues: [],
    });
  }

  public setYTo(y: number | Function): void {
    this.addVariableBasedBlock({
      mainBlockOpcode: "motion_sety",
      inputValues: [
        {
          inputFieldName: "Y",
          values: [
            [1, [4, `${y}`]],
            [3, this.getBlockId(0, true) + "0", [4, "1"]],
          ],
          parameterValue: y,
        },
      ],
      fieldValues: [],
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

  public getDirection(): string {
    return "motion_direction";
  }

  public sayForSeconds(
    text: string | Function,
    seconds: number | Function
  ): void {
    this.addVariableBasedBlock({
      mainBlockOpcode: "looks_sayforsecs",
      inputValues: [
        {
          inputFieldName: "MESSAGE",
          values: [
            [1, [10, `${text}`]],
            [3, this.getBlockId(0, true) + "0", [10, "0"]],
          ],
          parameterValue: text,
        },
        {
          inputFieldName: "SECS",
          values: [
            [1, [4, `${seconds}`]],
            [3, this.getBlockId(0, true) + "1", [10, "0"]],
          ],
          parameterValue: seconds,
        },
      ],
      fieldValues: [],
    });
  }

  public say(text: string | Function): void {
    this.addVariableBasedBlock({
      mainBlockOpcode: "looks_say",
      inputValues: [
        {
          inputFieldName: "MESSAGE",
          values: [
            [1, [10, `${text}`]],
            [3, this.getBlockId(0, true) + "0", [10, "0"]],
          ],
          parameterValue: text,
        },
      ],
      fieldValues: [],
    });
  }

  public thinkForSeconds(
    thinkText: string | Function,
    seconds: number | Function
  ): void {
    this.addVariableBasedBlock({
      mainBlockOpcode: "looks_thinkforsecs",
      inputValues: [
        {
          inputFieldName: "MESSAGE",
          values: [
            [1, [10, `${thinkText}`]],
            [3, this.getBlockId(0, true) + "0", [10, "0"]],
          ],
          parameterValue: thinkText,
        },
        {
          inputFieldName: "SECS",
          values: [
            [1, [4, `${seconds}`]],
            [3, this.getBlockId(0, true) + "1", [10, "0"]],
          ],
          parameterValue: seconds,
        },
      ],
      fieldValues: [],
    });
  }

  public think(thinkText: string | Function): void {
    this.addVariableBasedBlock({
      mainBlockOpcode: "looks_think",
      inputValues: [
        {
          inputFieldName: "MESSAGE",
          values: [
            [1, [10, `${thinkText}`]],
            [3, this.getBlockId(0, true) + "0", [10, "0"]],
          ],
          parameterValue: thinkText,
        },
      ],
      fieldValues: [],
    });
  }
}

export default Sprite;
