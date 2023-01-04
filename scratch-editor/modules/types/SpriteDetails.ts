import Block from "./Block";
import { Costume } from "./Sprite";

interface SpriteDetails {
  blocks: { [id: string]: Block };

  costumes: {
    availableCostumes: { [key: string]: string };
    costumes: Costume[];
    newCostumes: Costume[];
  };

  sounds: {
    soundsFolder: string | null;
    availableSounds: { [key: string]: string };
    sounds: Costume[]; //change this
  };
}

export default SpriteDetails;
