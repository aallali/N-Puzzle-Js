/**
 * 
 * @param {text data of the input file containing the puzzle generated} inputFileTxt 
 * @returns array 2D containing the puzzle only
 */
//-----EXAMPLE :
// # This puzzle is unsolvable
// 3
// 2 1 3
// 8 0 4
// 7 6 5

//-----OUTPUT :
// [ [ '2', '1', '3' ], [ '8', '0', '4' ], [ '7', '6', '5' ] ]
function parsePuzzle(inputFileTxt) {
    return inputFileTxt.split("\n").filter(line => /^([\d+| ]+)(\d{1,2})+$/.test(line)).map(l => l.split(" ").filter(l => l))
}

export default parsePuzzle