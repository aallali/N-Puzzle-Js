# n-puzzle-js
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
- [ ] add more heuristics (> 4)
- [ ] support using one or multiple heuristic
- [ ] update the puzzle parser for more accuracy and error handling
- [ ] add solvability checker
- [ ] config the solver to add type of target puzzle option (`zero last`, `zero first`, `snail`)
- [ ] create seprate method functions for the heuristics
- [ ] pack all the Puzzle solver into one package
- [ ] create an UI for n-puzzle using the package created in previous task