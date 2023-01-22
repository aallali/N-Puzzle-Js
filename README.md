## N-Puzzle (version: javascript)
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
- [ ] add more heuristics (> 4)
    - [x] `manhattan`
    - [x] `linear conflicts` 
    - [ ] `missplaced`
    - [ ] `hamming`
    - [ ] `gaschnig`
    - [ ] `euclidean`
    - [ ] `diagonal`
- [x] support using one or multiple heuristic
- [ ] update the puzzle parser for more accuracy and error handling
- [ ] add solvability checker
- [ ] config the solver to add type of target puzzle option (`zero last`, `zero first`, `snail`)
- [ ] create seprate method functions for the heuristics
- [ ] pack all the Puzzle solver into one package
- [ ] create an UI for n-puzzle using the package created in previous task

### Run the code :
```
- npm install
- npm run build
- npm run dev
```


### Example of input/output:
- input

[ input file ] ----------------------------------------------
```
# This puzzle is solvable
3
1 3 5
4 8 7
0 2 6
```
[ Solver params ] -------------------------------------------
```js
const params = {
    puzzle,
    greedy: false, // true == ignore the treeLevel score
    uniform: false, // true == ignore the heuristic score
    heuristic: ["manhattan", "linearConflicts"] // the heuristic to use
}
```

- output (npm run dev)
```
➜  n-puzzle-js git:(main) ✗ npm run start 
================
 1  2  3 
 8  █  4 
 7  6  5   score: 20
================
Step n: 21/21
---------------------------------------------
        Steps to solution  : 21
        complexity in time : 57
        complexity in size : 55
        Time spent :  0 s, 25.553 ms
---------------------------------------------
➜  n-puzzle-js git:(main) ✗

```