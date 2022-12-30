import Scratch from "./scratch-server/Scratch";
import Sprite from "./scratch-editor/Sprite";

async function main() {
  const scratch = new Scratch();
  await scratch.login("AbeIsGood", `console.log("1")`);

  const sprite = new Sprite("Sprite 1");
  sprite.whenGreenFlagClicked();

  console.log(
    await scratch.saveProject(775109266, {
      targets: [
        {
          isStage: true,
          name: "Stage",
          variables: {
            "`jEk@4|i[#Fk?(8x)AV.-my variable": ["my variable", 0],
            "K%~eWG1/`(9|5,w21r(,": ["hi", 0],
          },
          lists: {},
          broadcasts: {},
          blocks: {},
          comments: {},
          currentCostume: 0,
          costumes: [
            {
              name: "backdrop1",
              dataFormat: "svg",
              assetId: "cd21514d0531fdffb22204e0ec5ed84a",
              md5ext: "cd21514d0531fdffb22204e0ec5ed84a.svg",
              rotationCenterX: 240,
              rotationCenterY: 180,
            },
          ],
          sounds: [
            {
              name: "pop",
              assetId: "83a9787d4cb6f3b7632b4ddfebf74367",
              dataFormat: "wav",
              format: "",
              rate: 48000,
              sampleCount: 1123,
              md5ext: "83a9787d4cb6f3b7632b4ddfebf74367.wav",
            },
          ],
          volume: 100,
          layerOrder: 0,
          tempo: 60,
          videoTransparency: 50,
          videoState: "on",
          textToSpeechLanguage: null,
        },
        {
          isStage: false,
          name: "Sprite1",
          variables: {},
          lists: {},
          broadcasts: {},
          blocks: sprite.blocks,
          comments: {},
          currentCostume: 0,
          costumes: [
            {
              name: "costume1",
              bitmapResolution: 1,
              dataFormat: "svg",
              assetId: "3339a2953a3bf62bb80e54ff575dbced",
              md5ext: "3339a2953a3bf62bb80e54ff575dbced.svg",
              rotationCenterX: 0,
              rotationCenterY: 0,
            },
          ],
          sounds: [
            {
              name: "pop",
              assetId: "83a9787d4cb6f3b7632b4ddfebf74367",
              dataFormat: "wav",
              format: "",
              rate: 48000,
              sampleCount: 1123,
              md5ext: "83a9787d4cb6f3b7632b4ddfebf74367.wav",
            },
          ],
          volume: 100,
          layerOrder: 1,
          visible: true,
          x: 36,
          y: 28,
          size: 100,
          direction: 90,
          draggable: false,
          rotationStyle: "all around",
        },
      ],
      monitors: [
        {
          id: "K%~eWG1/`(9|5,w21r(,",
          mode: "default",
          opcode: "data_variable",
          params: {
            VARIABLE: "hi",
          },
          spriteName: null,
          value: 0,
          width: 0,
          height: 0,
          x: 5,
          y: 5,
          visible: true,
          sliderMin: 0,
          sliderMax: 100,
          isDiscrete: true,
        },
      ],
      extensions: [],
      meta: {
        semver: "3.0.0",
        vm: "1.2.54",
        agent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
    })
  );
}

main();
