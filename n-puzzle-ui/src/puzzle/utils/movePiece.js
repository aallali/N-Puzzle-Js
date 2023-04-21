
export const movePiece = (x, y, complete, puzzle) => {
    let dir = ""
    if (!complete) {
        if (checkNeighbours(x, y, 1, puzzle)) {
            const emptySlot = checkNeighbours(x, y, 1, puzzle);

            const newPuzzle = puzzle.map((row) => row.slice());

            if (x === emptySlot.x && y < emptySlot.y) {
                newPuzzle[emptySlot.x][emptySlot.y] = puzzle[x][y + 1];
                newPuzzle[x][y + 1] = newPuzzle[x][y];
                newPuzzle[x][y] = 0;
                dir = "R"
            } else if (x === emptySlot.x && y > emptySlot.y) {
                newPuzzle[emptySlot.x][emptySlot.y] = puzzle[x][y - 1];
                newPuzzle[x][y - 1] = newPuzzle[x][y];
                newPuzzle[x][y] = 0;
                dir = "L"
            }

            if (y === emptySlot.y && x < emptySlot.x) {
                newPuzzle[emptySlot.x][emptySlot.y] = puzzle[x + 1][y];
                newPuzzle[x + 1][y] = newPuzzle[x][y];
                newPuzzle[x][y] = 0;
                dir = "D"
            } else if (y === emptySlot.y && x > emptySlot.x) {
                newPuzzle[emptySlot.x][emptySlot.y] = puzzle[x - 1][y];
                newPuzzle[x - 1][y] = newPuzzle[x][y];
                newPuzzle[x][y] = 0;
                dir = "U"
            }

            return { puzzle: newPuzzle, dir }
            // check completion of the puzzle

        }
    }
};

const checkNeighbours = (x, y, d = 1, puzzle) => {
    const neighbours = [];

    if (puzzle[x][y] !== 0) {
        neighbours.push(
            puzzle[x - d] && puzzle[x - d][y] === 0 && { x: x - d, y: y }
        );
        neighbours.push(puzzle[x][y + d] === 0 && { x: x, y: y + d });
        neighbours.push(
            puzzle[x + d] && puzzle[x + d][y] === 0 && { x: x + d, y: y }
        );
        neighbours.push(puzzle[x][y - d] === 0 && { x: x, y: y - d });
    }

    const emptySlot = neighbours.find((el) => typeof el === "object");

    return emptySlot;
};