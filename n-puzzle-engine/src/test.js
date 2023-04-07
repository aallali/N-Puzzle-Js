import { PuzzleGenerator, parsePuzzle, generateGoal, printPuzzle, blok } from "./utils";
import Node from "./lib/node";
import Solver from "./lib/solver";
import readFile from "./utils/loadinput"

const { log } = console;

async function main() {
    const goalPuzzle = "snail"

    // read input file containing the puzzle
    const inputFileTxt = await readFile("./src/input");
    // parse the puzzle from the puzzle into 2d array
    const puzzle = parsePuzzle(inputFileTxt);
    // const puzzle = new PuzzleGenerator(4, goalPuzzle, true, 3)
    printPuzzle(puzzle)


    // generated the tar/get puzzle need to be reach (˜the goal puzzle)
    const goal = generateGoal[goalPuzzle](puzzle.length);

    // set the params which will be used in the solving algorithm
    // Heuristics Supportedd:
    // 		"manhattan", "linearConflicts",  "hamming", 
    // 		"euclidean", "diagonal", "gaschnig"
    const params = {
        puzzle: puzzle,
        greedy: true, // true == ignore the treeLevel score
        uniform: false, // true == ignore the heuristic score
        heuristic: ["manhattan", "linearConflicts"], // the list of heuristics to use
        queueType: "heapQ"  // "heapQ" or "priorityQ"
    }

    // generate new node of the this puzzle which will be the first puzzle in the solver
    const initPuzzle = new Node(params.puzzle, params.greedy, params.uniform, goal, undefined, params.heuristic);
    // display puzzle to terminal
    printPuzzle(initPuzzle.puzzle, initPuzzle.score)

    // init a solver instant and start the process
    const solver = new Solver(initPuzzle, params.queueType);
    if (!solver.isSolvable) {
        log(`[ This puzzle is not solvable to '${goalPuzzle}' state, try change the puzzle or change the final state ]`)
        return
    }
    let solution = await solver.start();

    if (solution) {
        const steps = solution.steps
        const t = { s: parseInt(solution.time / 1000), m: solution.time % 1000 }

        // animate the steps in consol
        for (let i = 0; i < steps.length; i++) {
            console.clear()
            printPuzzle(steps[i][0], steps[i][1])
            log(`Step n: ${i + 1}/${steps.length}`)
            await blok(0.1)
        }

        // print required detailes about the solution asked in the subject pdf
        log('---------------------------------------------')
        log(`	Steps to solution  :`, solution.steps.length)
        log("	complexity in time :", solution.cTime)
        log("	complexity in size :", solution.cSize)
        log("	Time spent : ", t.s, "s,", t.m, "ms")
        log('---------------------------------------------')
    } else
        log("[ Sorry i cant solve this, take that s**t away from me, thanks! ]")

}
main();
