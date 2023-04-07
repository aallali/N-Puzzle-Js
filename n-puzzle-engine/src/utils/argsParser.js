// const args = require("args-parser")(process.argv);

// const { log } = console;
// // args
// /**
//  * -hr : heuristic
//  * -algo : solving algorithm
//  * -goal : goalpuzzle type
//  * -gen generate puzzle
//  * -i : iteration for the generation of puzzle
//  * -g : greedy
//  * -u : uniform
//  * -o : output file
//  *
//  */

 
//     log(`
// Welcome to N-Puzzle solver:
// The program tries to solve a puzzle of size 'n' with some options you give:

// -h,--heuristic    the heuristics you want to use in the solving process
//                   { manhattan - gaschnig - linearConflicts - euclidean - diagonal - hamming }
//                   default : manhattan
                  
// -a, --algo        the algorithm to use to solve the puzzle
//                   - aStar, BFS, DFS IDFS
//                   default : aStar

// -goal             the type of goal puzzle you want to reach
//                     - snail (zero in center)
//                     - zf (zero first)
//                     - zl (zero last)
//                   default : snail

// -gen,--generate : generate a puzzle of size N you have to give
//                     - 3,4,5,6,7....
//                   default: NONE
//                   required: yes, if param mentioned

// -i                number of iterations to shuffle in case of puzzle generation
//                   default : 1000

// -g,--greedy       apply the greedy search in solving process (ignore the depth in tree score)
//                   default : false

// -u,--uniform      apply the uniform search in solving process (ignore the heuristic score)
//                   default : false

// -o,--output       the filename to output the solution and stats to.
//                   required: yes, if param mentioned
// `)


// console.info(args);
