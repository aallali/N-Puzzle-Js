import { parsePuzzle, readFile } from "./utils";

const { log } = console;

async function main() {
  const inputFileTxt = await readFile("./src/input");

  const puzzle = parsePuzzle(inputFileTxt);

  log(puzzle)
}
main();
