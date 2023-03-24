
/*
// the python code that i translated
def count_inversions(puzzle, solved, size):
    res = 0
    for i in range(size * size - 1):
        for j in range(i + 1, size * size):            
                vi = puzzle[i]
                vj = puzzle[j]
                if solved.index(vi) > solved.index(vj):
                    res += 1
    return res

def is_solvable(puzzle, solved, size):
    inversions = count_inversions(puzzle, solved, size)
    puzzle_zero_row = puzzle.index(EMPTY_TILE) // size
    puzzle_zero_column = puzzle.index(EMPTY_TILE) % size
    solved_zero_row = solved.index(EMPTY_TILE) // size
    solved_zero_column = solved.index(EMPTY_TILE) % size
    taxicab = abs(puzzle_zero_row - solved_zero_row) + abs(puzzle_zero_column - solved_zero_column)
    if taxicab % 2 == 0 and inversions % 2 == 0:
        return True
    if taxicab % 2 == 1 and inversions % 2 == 1:
        return True
    return False
*/
const EMPTY_TILE = 0;
function count_inversions(puzzle, solved, size) {
    let res = 0 
    
    for (let i = 0; i < (size ** 2); i++) {
        for (let j = i + 1; j < (size ** 2); j++) {
            const [vi, vj] = [puzzle[i], puzzle[j]]
            if (solved.indexOf(vi) > solved.indexOf(vj))
                res++;
        }
    }
    return res;
}

function is_solvable(puzzle, solved, size) {
    solved = [].concat.apply([], solved).map(n => parseInt(n));
    puzzle = [].concat.apply([], puzzle).map(n => parseInt(n));
    const inversions = count_inversions(puzzle, solved, size),
        puzzle_zero_row = Math.floor(puzzle.indexOf(EMPTY_TILE) / size),
        puzzle_zero_column = puzzle.indexOf(EMPTY_TILE) % size,
        solved_zero_row = Math.floor(solved.indexOf(EMPTY_TILE) / size),
        solved_zero_column = solved.indexOf(EMPTY_TILE) % size,
        taxicab = Math.abs(puzzle_zero_row - solved_zero_row) + Math.abs(puzzle_zero_column - solved_zero_column)

    
    if (taxicab % 2 == 0 && inversions % 2 == 0)
        return true
    if (taxicab % 2 == 1 && inversions % 2 == 1)
        return true
    return false
}

export default is_solvable