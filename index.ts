import Scratch from "./modules/scratch";

const scratch: Scratch = new Scratch();

async function main() {
  await scratch.login("AbeIsGood", "Catterpillar!23");
}

main();
