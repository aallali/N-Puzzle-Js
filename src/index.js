import { parsePuzzle, readFile, generateGoal } from "./utils";
import Node from "./lib/node";
import Solver from "./lib/solver";

const { log } = console;

async function main() {
	// read input file containing the puzzle
	const inputFileTxt = await readFile("./src/input");
	// parse the puzzle from the puzzle into 2d array
	const puzzle = parsePuzzle(inputFileTxt);
	// generated the target puzzle need to be reach (˜the goal puzzle)
	const goal = generateGoal.snail(puzzle.length);
 
	// set the params which will be used in the solving algorithm
	const params = {
		puzzle,
		greedy: false,
		uniform: false,
		heuristic: "manhattan"
	}

	// generate new node of the this puzzle which will be the first puzzle in the solver
	const init = new Node(params.puzzle, params.greedy, params.uniform, goal, undefined, params.heuristic);

	// init a solver instant and start the process
	const solver = new Solver(init);
	solver.start();
}
main();
