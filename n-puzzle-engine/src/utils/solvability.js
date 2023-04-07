
/* eslint-disable eqeqeq */

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