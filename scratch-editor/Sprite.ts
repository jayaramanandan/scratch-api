import { createHash } from "crypto";
import SimpleBlock from "./modules/SimpleBlock";
import { VariableBasedBlock } from "./modules/VariableBasedBlock";
import { Costume } from "./modules/Sprite";
import MenuBasedBlock from "./modules/MenuBasedBlock";
import Block from "./modules/Block";
import { BlockDetails, Field, Inputs } from "./modules/BlockDetails";

class Sprite {
  public blocks: { [id: string]: Block } = {};
  private spriteHash: string;
  private blocksCount: number = 0;
  private costumes: { availableCostumes: any; costumes: Costume[] } = {
    availableCostumes: { abe: [] },
    costumes: [],
  };
  private availableBackdrops: any = { abe: [] };

  constructor(public name: string, private costumeImageFileName?: string) {
    this.spriteHash = createHash("sha256").update(name).digest("base64");
  }

  private addBlock({
    opcode,
    blockParameters,
    topLevel,
    x,
    y,
  }: BlockDetails): void {
    let inputs: Inputs = {};
    let fields: Field = {};

    for (let i: number = 0; i < blockParameters.length; i++) {
      if (blockParameters[i].parameterType == "parameter") {
        if (typeof blockParameters[i].parameterValue == "function") {
          this.blocks[`${this.getBlockId(0, "variable")}${i}`] = {
            opcode: blockParameters[i].parameterValue(),
            inputs: {},
            fields: {},
            parent: this.getBlockId(0),
            next: null,
            shadow: false,
            topLevel: false,
          };

          inputs[blockParameters[i].parameterName] = [
            3,
            `${this.getBlockId(0, "variable")}${i}`,
            [blockParameters[i].parameterArrayNumber, ""],
          ];
        } else {
          inputs[blockParameters[i].parameterName] = [
            1,
            [
              blockParameters[i].parameterArrayNumber,
              `${blockParameters[i].parameterValue}`,
            ],
          ];
        }
      } else if (blockParameters[i].parameterType == "menu") {
        if (typeof blockParameters[i].menuBlockOpcode == "undefined")
          throw new Error("Menu block opcode needed");

        if (typeof blockParameters[i].parameterValue == "function") {
          inputs[blockParameters[i].parameterName] = [
            3,
            this.getBlockId(0, "variable") + i,
            this.getBlockId(0, "menu") + i,
          ];

          this.blocks[this.getBlockId(0, "variable") + i] = {
            opcode: blockParameters[i].parameterValue(),
            inputs: {},
            fields: {},
            parent: this.getBlockId(0),
            next: null,
            shadow: false,
            topLevel: false,
          };

          this.blocks[this.getBlockId(0, "menu") + i] = {
            opcode: `${blockParameters[i].menuBlockOpcode}`,
            inputs: {},
            fields: { [blockParameters[i].parameterName]: ["", null] },
            parent: null,
            next: null,
            shadow: true,
            topLevel: false,
          };
        } else {
          inputs[blockParameters[i].parameterName] = [
            1,
            this.getBlockId(0, "menu") + `${i}`,
          ];

          this.blocks[this.getBlockId(0, "menu") + i] = {
            opcode: `${blockParameters[i].menuBlockOpcode}`,
            inputs: {},
            fields: {
              [blockParameters[i].parameterName]: [
                blockParameters[i].parameterValue,
                null,
              ],
            },
            parent: null,
            next: null,
            shadow: true,
            topLevel: false,
          };
        }
      } else if (blockParameters[i].parameterType == "dropdown") {
        if (typeof blockParameters[i].parameterValue == "function")
          throw new Error("dropdowns cannot be given function paramter values");

        fields[blockParameters[i].parameterName] = [
          blockParameters[i].parameterValue,
          null,
        ];
      }
    }

    this.blocks[this.getBlockId(0)] = {
      opcode,
      inputs,
      fields,
      parent: Object.keys(this.blocks).length == 0 ? null : this.getBlockId(-1),
      next: null,
      shadow: false,
      topLevel,
      x,
      y,
    };

    this.blocksCount++;
    this.blocks[this.getBlockId(-1)].next = this.getBlockId(0);
  }

  private getBlockId(
    blockCountsAway: number,
    blockType?: "variable" | "menu"
  ): string {
    let prefix: string = "";

    if (blockType == "variable") prefix = "variableBlock-";
    else if (blockType == "menu") prefix = "menuBlock-";

    return `${prefix}${this.spriteHash}${this.blocksCount + blockCountsAway}`;
  }

  public whenGreenFlagClicked(): void {
    this.addBlock({
      opcode: "event_whenflagclicked",
      blockParameters: [],
      topLevel: true,
      x: 0,
      y: 0,
    });
  }

  public moveSteps(steps: number | Function): void {
    this.addBlock({
      opcode: "motion_movesteps",
      blockParameters: [
        {
          parameterType: "parameter",
          parameterName: "STEPS",
          parameterArrayNumber: 4,
          parameterValue: steps,
        },
      ],
      topLevel: false,
    });
  }

  public turnDegrees(
    direction: "right" | "left",
    degrees: number | Function
  ): void {
    this.addBlock({
      opcode: `motion_turn${direction}`,
      blockParameters: [
        {
          parameterType: "parameter",
          parameterName: "DEGREES",
          parameterArrayNumber: 4,
          parameterValue: degrees,
        },
      ],
      topLevel: false,
    });
  }

  public goToCoordinates(x: number | Function, y: number | Function): void {
    this.addBlock({
      opcode: "motion_gotoxy",
      blockParameters: [
        {
          parameterType: "parameter",
          parameterName: "X",
          parameterArrayNumber: 4,
          parameterValue: x,
        },
        {
          parameterType: "parameter",
          parameterName: "Y",
          parameterArrayNumber: 4,
          parameterValue: y,
        },
      ],
      topLevel: false,
    });
  }

  public goToLocation(location: "random" | "mouse" | Sprite): void {
    this.addBlock({
      opcode: "motion_goto",
      blockParameters: [
        {
          parameterType: "menu",
          parameterName: "TO",
          parameterArrayNumber: 4,
          parameterValue:
            typeof location == "object" ? location.name : `_${location}_`,
          menuBlockOpcode: "motion_goto_menu",
        },
      ],
      topLevel: false,
    });
  }

  public glideToCoordinates(
    seconds: number | Function,
    x: number | Function,
    y: number | Function
  ): void {
    this.addBlock({
      opcode: "motion_glidesecstoxy",
      blockParameters: [
        {
          parameterType: "parameter",
          parameterName: "SECS",
          parameterArrayNumber: 4,
          parameterValue: seconds,
        },
        {
          parameterType: "parameter",
          parameterName: "X",
          parameterArrayNumber: 4,
          parameterValue: x,
        },
        {
          parameterType: "parameter",
          parameterName: "Y",
          parameterArrayNumber: 4,
          parameterValue: y,
        },
      ],
      topLevel: false,
    });
  }

  public glideToLocation(
    seconds: number | Function,
    location: "random" | "mouse" | Sprite
  ): void {
    this.addBlock({
      opcode: "motion_glideto",
      blockParameters: [
        {
          parameterType: "parameter",
          parameterName: "SECS",
          parameterArrayNumber: 4,
          parameterValue: seconds,
        },
        {
          parameterType: "menu",
          parameterName: "TO",
          parameterArrayNumber: 4,
          parameterValue:
            typeof location == "object" ? location.name : `_${location}_`,
          menuBlockOpcode: "motion_glideto_menu",
        },
      ],
      topLevel: false,
    });
  }

  public pointInDirection(degrees: number | Function): void {
    if (degrees < -90 || degrees > 180)
      throw new Error(
        "pointInDirection function takes degrees argument to be between -90 and 180 only"
      );

    this.addBlock({
      opcode: "motion_pointindirection",
      blockParameters: [
        {
          parameterType: "parameter",
          parameterName: "DIRECTION",
          parameterArrayNumber: 4,
          parameterValue: degrees,
        },
      ],
      topLevel: false,
    });
  }

  public pointTowards(location: "mouse" | Sprite): void {
    this.addBlock({
      opcode: "motion_pointtowards",
      blockParameters: [
        {
          parameterType: "menu",
          parameterName: "TOWARDS",
          parameterArrayNumber: 4,
          parameterValue: location == "mouse" ? `_${location}_` : location.name,
          menuBlockOpcode: "motion_pointtowards_menu",
        },
      ],
      topLevel: false,
    });
  }

  public changeXBy(x: number | Function): void {
    this.addBlock({
      opcode: "motion_changexby",
      blockParameters: [
        {
          parameterType: "parameter",
          parameterName: "DX",
          parameterArrayNumber: 4,
          parameterValue: x,
        },
      ],
      topLevel: false,
    });
  }

  public changeYBy(y: number | Function): void {
    this.addBlock({
      opcode: "motion_changeyby",
      blockParameters: [
        {
          parameterType: "parameter",
          parameterName: "DY",
          parameterArrayNumber: 4,
          parameterValue: y,
        },
      ],
      topLevel: false,
    });
  }

  public setXTo(x: number | Function): void {
    this.addBlock({
      opcode: "motion_setx",
      blockParameters: [
        {
          parameterType: "parameter",
          parameterName: "X",
          parameterArrayNumber: 4,
          parameterValue: x,
        },
      ],
      topLevel: false,
    });
  }

  public setYTo(y: number | Function): void {
    this.addBlock({
      opcode: "motion_sety",
      blockParameters: [
        {
          parameterType: "parameter",
          parameterName: "Y",
          parameterArrayNumber: 4,
          parameterValue: y,
        },
      ],
      topLevel: false,
    });
  }

  public ifOnEdgeBounce(): void {
    this.addBlock({
      opcode: "motion_ifonedgebounce",
      blockParameters: [],
      topLevel: false,
    });
  }

  public setRotationStyle(
    style: "left-right" | "don't rotate" | "all around"
  ): void {
    this.addBlock({
      opcode: "motion_setrotationstyle",
      blockParameters: [
        {
          parameterType: "dropdown",
          parameterName: "STYLE",
          parameterArrayNumber: 4,
          parameterValue: style,
        },
      ],
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
    this.addBlock({
      opcode: "looks_sayforsecs",
      blockParameters: [
        {
          parameterType: "parameter",
          parameterName: "MESSAGE",
          parameterArrayNumber: 10,
          parameterValue: text,
        },
        {
          parameterType: "parameter",
          parameterName: "SECS",
          parameterArrayNumber: 10,
          parameterValue: seconds,
        },
      ],
      topLevel: false,
    });
  }

  public say(text: string | Function): void {
    this.addBlock({
      opcode: "looks_say",
      blockParameters: [
        {
          parameterType: "parameter",
          parameterName: "MESSAGE",
          parameterArrayNumber: 10,
          parameterValue: text,
        },
      ],
      topLevel: false,
    });
  }

  public thinkForSeconds(
    thinkText: string | Function,
    seconds: number | Function
  ): void {
    this.addBlock({
      opcode: "looks_thinkforsecs",
      blockParameters: [
        {
          parameterType: "parameter",
          parameterName: "MESSAGE",
          parameterArrayNumber: 10,
          parameterValue: thinkText,
        },
        {
          parameterType: "parameter",
          parameterName: "SECS",
          parameterArrayNumber: 10,
          parameterValue: seconds,
        },
      ],
      topLevel: false,
    });
  }

  public think(thinkText: string | Function): void {
    this.addBlock({
      opcode: "looks_think",
      blockParameters: [
        {
          parameterType: "parameter",
          parameterName: "MESSAGE",
          parameterArrayNumber: 10,
          parameterValue: thinkText,
        },
      ],
      topLevel: false,
    });
  }

  public switchCostumeTo(costumeName: string | Function): void {
    if (
      typeof costumeName == "string" &&
      this.costumes.availableCostumes[costumeName] == undefined
    )
      throw new Error(`${costumeName} is not an available costume`);

    this.addBlock({
      opcode: "looks_switchcostumeto",
      blockParameters: [
        {
          parameterType: "menu",
          parameterName: "COSTUME",
          parameterArrayNumber: 10,
          parameterValue: costumeName,
          menuBlockOpcode: "looks_costume",
        },
      ],
      topLevel: false,
    });
  }

  public nextCostume(): void {
    this.addBlock({
      opcode: "looks_nextcostume",
      blockParameters: [],
      topLevel: false,
    });
  }

  public switchBackdropTo(
    backdropName:
      | "next backdrop"
      | "previous backdrop"
      | "random backdrop"
      | string
      | Function
  ): void {
    if (
      typeof backdropName == "string" &&
      this.availableBackdrops[backdropName] == undefined &&
      backdropName != "next backdrop" &&
      backdropName != "previous backdrop" &&
      backdropName != "random backdrop"
    )
      throw new Error(`${backdropName} is not an available backdrop`);

    this.addBlock({
      opcode: "looks_switchbackdropto",
      blockParameters: [
        {
          parameterType: "menu",
          parameterName: "BACKDROP",
          parameterArrayNumber: 10,
          parameterValue: backdropName,
          menuBlockOpcode: "looks_backdrops",
        },
      ],
      topLevel: false,
    });
  }

  public nextBackdrop(): void {
    this.addBlock({
      opcode: "looks_nextbackdrop",
      blockParameters: [],
      topLevel: false,
    });
  }

  public changeSizeBy(change: number | Function): void {
    this.addBlock({
      opcode: "looks_changesizeby",
      blockParameters: [
        {
          parameterType: "parameter",
          parameterName: "CHANGE",
          parameterArrayNumber: 10,
          parameterValue: change,
        },
      ],
      topLevel: false,
    });
  }

  public setSizeTo(sizePercentage: number | Function): void {
    this.addBlock({
      opcode: "looks_setsizeto",
      blockParameters: [
        {
          parameterType: "parameter",
          parameterName: "SIZE",
          parameterArrayNumber: 10,
          parameterValue: sizePercentage,
        },
      ],
      topLevel: false,
    });
  }
}

export default Sprite;
