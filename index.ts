import Scratch from "./modules/scratch";

const scratch: Scratch = new Scratch();

async function main() {
  (await scratch.getFeaturedItems()).community_featured_studios;
}

main();
