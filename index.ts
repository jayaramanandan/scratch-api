import Scratch from "./modules/Scratch";
import Sprite from "./modules/Sprite";

const scratch: Scratch = new Scratch();

async function main() {
  const sprite = new Sprite("ben");
  sprite.whenGreenFlagClicked();
}

main();
