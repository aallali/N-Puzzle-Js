### N-Puzzle (version: javascript)

###### check Python version [here](https://github.com/aallali/N-Puzzle)

    The goal of this project is to solve the N-puzzle ("taquin" in French) game using the A*
    search algorithm or one of its variants.

    You start with a square board made up of N*N cells. One of these cells will be empty,
    the others will contain numbers, starting from 1, that will be unique in this instance of
    the puzzle.

    Your search algorithm will have to find a valid sequence of moves in order to reach the
    final state, a.k.a the "snail solution", which depends on the size of the puzzle (Example
    below). While there will be no direct evaluation of its performance in this instance of the
    project, it has to have at least a vaguely reasonable perfomance : Taking a few second to
    solve a 3-puzzle is pushing it, ten seconds is unacceptable.

    The only move one can do in the N-puzzle is to swap the empty cell with one of its
    neighbors (No diagonals, of course. Imagine you’re sliding a block with a number on it
    towards an empty space).

### Todo list

- [x] add bloomFilter for the `visited set` for faster filtering than normal `new set`
- [x] comment all code in all files.
- [x] fix the greedy/uniform implementation
- [x] simplify the implemention of greedy condition in lib/node.js
- [x] add more heuristics (> 4)
  - [x] `manhattan`
  - [x] `linear conflicts` = (`manhattan * 1.5 + conflicts`)
  - [x] `hamming (missplaced)`
  - [x] `gaschnig` ([details](https://cse-robotics.engr.tamu.edu/dshell/cs625/gaschnig-note.pdf))
  - [x] `euclidean`
  - [x] `diagonal`
  - read more about heuristics here ([click me](https://www.aaai.org/Papers/AAAI/1996/AAAI96-178.pdf))
- [x] support using one or multiple heuristic
- [x] update the puzzle parser for more accuracy and error handling
- [x] add solvability checker
- [x] config the solver to add type of target puzzle option (`zero last`, `zero first`, `snail`)
- [x] create seprate method functions for the heuristics
- [x] pack all the Puzzle solver into one package
- [ ] write unit tests for the engine
- [ ] add folder to contain different puzzle inputs file for testing
- [ ] create an UI for n-puzzle using the package created in previous task (70%)

### Run the code :

```
- npm install
- npm run build
- npm run dev
```

### Example of input/output:

- input of puzzle size 3x3, with no score (f) or path cost (g) counting, open all paths until solution using heapQ algorithm

[ input file ] ----------------------------------------------

```
# This puzzle is solvable
3
0 2 6
4 3 1
7 5 8
```

[ Solver params ] -------------------------------------------

```js
const params = {
  goal: "snail",
  puzzle: puzzle.puzzle,
  greedy: false, // true == ignore the treeLevel score
  uniform: false, // true == ignore the heuristic score
  heuristic: ["manhattan"], // the list of heuristics to use
  queueType: "heapQ", // "heapQ" or "priorityQ"
};
```
[ Search Algorithm used ] : BFS (Breadth First Search)
- the params (greedy && uniform) are overwritten by BFS functions
- params.heuristics is ignored since BFS doesn't rely on the board score.
```js
let solution = await solver.start_BFS(Infinity, initPuzzle);
```
- output (npm run dev)

```shell
➜  n-puzzle-JS/n-puzzle-engine git:(main) ✗ npm run dev
================
 _  2  6
 4  3  1
 7  5  8   score: 14
================
---------------------------------------------
        Steps to solution  : 22 [R,D,R,U,L,L,D,R,R,D,L,U,R,U,L,L,D,R,U,R,D,L]
        complexity in time : 78035
        complexity in size : 23959
        Time spent :  4 s, 598 ms
---------------------------------------------
➜  n-puzzle-JS/n-puzzle-engine git:(main) ✗

```
