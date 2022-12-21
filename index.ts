import Scratch from "./modules/Scratch";
import Sprite from "./modules/Sprite";

const scratch: Scratch = new Scratch();

async function main() {
  const sprite = new Sprite("ben");
  sprite.whenGreenFlagClicked();
  sprite.moveSteps(5);
  sprite.turnDegrees("left", 10);

  sprite.whenGreenFlagClicked();
  sprite.moveSteps(5);
  sprite.goToLocation(sprite);
}

main();
