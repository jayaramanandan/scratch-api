import Block from "./Block";
import { Costume, Sound } from "./Sprite";

interface SpriteDetails {
  blocks: { [id: string]: Block };

  costumes: {
    availableCostumes: { [key: string]: string };
    costumes: Costume[];
    newCostumes: Costume[];
  };

  sounds: {
    availableSounds: { [key: string]: string };
    sounds: Sound[]; //change this
  };
}

export default SpriteDetails;
