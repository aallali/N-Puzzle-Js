const args = require('args-parser')(process.argv);
// args
/**
 * -hr : heuristic
 * -algo : solving algorithm
 * -goal : goalpuzzle type 
 * -gen generate puzzle
 * -i : iteration for the generation of puzzle
 * -g : greedy
 * -u : uniform
 * -o : output file
 * 
 */
console.info(args);