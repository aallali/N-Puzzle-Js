const { log } = console;

export default class Node {
  constructor(puzzle, greedy, uniform, goal, parent, heuristics) {
    this.puzzle = puzzle;

    this.treeLevel = 0
    if (!greedy) {
      if (parent === undefined) // if parent undefined means its first element, so treeLevel should be 0
        this.treeLevel = 0
      else // means it's child node, so the treeLevel should equal to (= parent.Level + 1)
        this.treeLevel = parent.treeLevel + 1
    }
    ;
    this.hash = this.toHash(this.puzzle);
    this.parent = parent && {
      parent: parent.parent,
      puzzle: parent.puzzle,
      score: parent.score
    };

    this.goal = goal;
    this.isFinal = this.checkIfFinal();
    this.childs = [];
    this.score = this.treeLevel + (uniform ? 0 : this.calculateScore(heuristics)); // if uniform is true, heuristic score should be 0 (ignored)

    // generate the params of childs if any, and keep them sleeping (param only without Node object)
    this.genChilds(uniform, greedy, heuristics);
  }

  /**
   * 
   * @param {[][]} twoDarray 
   * @returns from 2d arary to single string with all element of the array joined by dot "." 
   */
  toHash(twoDarray) {
    return (twoDarray || this.puzzle).map((row) => row.join(".")).join(".");
  }
  /**
   * 
   * @param {string} heuristic 
   * @returns score value of current puzzle using algo of heuristic given.
   */
  calculateScore(heuristics) {
    let score = 0;
    let ready_scores = this.heuristics_in_one_loop()
    const heuristicsFunctions = {
      "manhattan": () => ready_scores.manhattan,
      "linearConflicts": () => (ready_scores.manhattan + 2 * this.heuristic_linear_conflicts()),
      "hamming": () => ready_scores.hamming,
      "euclidean": () => ready_scores.euclidean,
      "diagonal": () => ready_scores.diagonal,
      "gaschnig": () => this.heuristic_gaschnig()
    }
    heuristics.forEach(heuristic => {
      score += heuristicsFunctions[heuristic]()
    });

    return score;
  }
  /**
   * since some heuristics use same loop through the puzzle, and to avoid unnecessary computation
   * i added gathered those heuristics's score calculation in one loop at the same time
   * and then you can choose what you want from the object returned
   * containing each heuristic score
   * @returns 
   */
  heuristics_in_one_loop() {
    let manhattan = 0;
    let hamming = 0;
    let euclidean = 0;
    let diagonal = 0;
    const size = this.puzzle.length;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {

        try {
          // current tile in the loop
          const currentTile = this.puzzle[i][j];
          // find the index of same tile value but in the goal puzzle
          const tileInGoal = this.findindexOf(this.goal, currentTile);
          // find the tile that match the current i,j value in goal puzzle
          const mirrorInGoal = this.goal[i][j];
          // the distance between the X value of current tile and its equivalent in the goal puzzle
          let d1 = Math.abs(i - tileInGoal.x);
          // the distance between the Y value of current tile and its equivalent in the goal puzzle
          let d2 = Math.abs(j - tileInGoal.y);

          // calc hamming score
          if (currentTile != mirrorInGoal)
            hamming += currentTile != mirrorInGoal ? 1 : 0;

          // calc manhattan score
          manhattan += d1 + d2;

          // calc euclidean score
          euclidean += Math.sqrt(d1 ** 2 + d2 ** 2)

          // calc diagonal
          diagonal += Math.max(d1, d2)
        } catch (err) {
          throw (err)
        }
      }
    }
    euclidean = Number(euclidean.toFixed(4))


    return { manhattan, hamming, euclidean, diagonal }
  }
  /**
   * the function that calculate the linear conflicts score of the puzzle
   * @returns 
   */
  heuristic_linear_conflicts() {
    let conflicts = 0;
    const size = this.puzzle.length;
    const values = size * size;

    for (let i = 1; i < values - 1; i++) {
      for (let j = 2; j < values; j++) {
        const currI = this.findindexOf(this.puzzle, i);
        const currJ = this.findindexOf(this.puzzle, j);
        const targI = this.findindexOf(this.goal, i);
        const targJ = this.findindexOf(this.goal, j);

        if (currI.x === currJ.x && targI.x === targJ.x)
          if ((currI.y < currJ.y && targI.y > targJ.y) || (currI.y > currJ.y && targI.y < targJ.y))
            conflicts++;

        if (currI.y === currJ.y && targI.y === targJ.y)
          if ((currI.x < currJ.x && targI.x > targJ.x) || (currI.x > currJ.x && targI.x < targJ.x))
            conflicts++;
      }
    }
    return conflicts;
  }
  /**
   * the gaschnig heuristic implementation
   * @returns 
   */
  heuristic_gaschnig() {
    // Compute it like this:
    // i. If the blank is where it should be in goal configuration, move any mismatched tile into the blank.
    // ii. Now find the tile that should go in the blank’s location, and teleport it there.
    // iii. Repeat (i. and ii.) until all are in their final positions.
    let score = 0
    const currentMap = JSON.parse(JSON.stringify(this.puzzle));
    const goal = JSON.parse(JSON.stringify(this.goal));
    const goalHash = this.toHash(goal);


    while (this.toHash(currentMap) != goalHash) {
      const cmz = this.findindexOf(currentMap, "0");
      if (goal[cmz.x][cmz.y] == "0") { // the zero not in its goal place
        for (let i = 0; i < this.puzzle.length; i++)
          for (let j = 0; j < this.puzzle.length; j++)
            if (currentMap[i][j] != goal[i][j]) {
              const tmp = currentMap[i][j]
              currentMap[i][j] = currentMap[cmz.x][cmz.y]
              currentMap[cmz.x][cmz.y] = tmp
              break
            }
      } else { // the zero in goal place
        const sv = goal[cmz.x][cmz.y]
        const ci = this.findindexOf(currentMap, sv)
        const tmp = currentMap[cmz.x][cmz.y]
        currentMap[cmz.x][cmz.y] = currentMap[ci.x][ci.y]
        currentMap[ci.x][ci.y] = tmp
      }
      score++
    }

    return score
  }
  /**
   * 
   * @param {boolean} u 
   * @param {boolean} g 
   * @param {string} heuristic
   * @output generate all the possible childrens from current puzzle by trying to move 0 tile to all direction
   */
  genChilds(u, g, heuristic) {
    const moves = {
      right: { x: 0, y: 1 },
      up: { x: -1, y: 0 },
      left: { x: 0, y: -1 },
      down: { x: 1, y: 0 },
    };
    // find the index of 0 in the current puzzle
    const zeroIdx = this.findindexOf(this.puzzle, "0");
    // loop through the moves directions
    for (const dir in moves) {
      // generate new puzzle with possible move of '0'
      // if the move is valid new puzzle will be returned
      // if the move is invalid 'null' will be returned
      const newPuzzle = this.moveTile(
        zeroIdx,
        moves[dir],
        JSON.parse(JSON.stringify(this.puzzle))
      );

      if (newPuzzle) {
        this.childs.push([newPuzzle, g, u, heuristic]);
      }
    }
  }
  /**
   * 
   * @param {[][]}} arr2D 
   * @param {string} trgt 
   * @returns {x: number, y: number} coordination of the trgt in arr2D if found
   * @returns {undefined} if not found 
   */
  findindexOf(arr2D, trgt) {
    const size = arr2D.length;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (arr2D[i][j] == trgt) return { x: i, y: j };
      }
    }
  }

  /**
   * 
   * @param {x: number, y: number} tilePos 
   * @param {x: number, y: number} direction 
   * @param {[][]]} array2D 
   * @returns new 2d array with tile at given position moved to direction given in the array2D given
   */
  moveTile(tilePos, direction, array2D) {
    const array2DSize = array2D.length;
    if (
      direction.x + tilePos.x >= array2DSize ||
      direction.x + tilePos.x < 0 ||
      direction.y + tilePos.y >= array2DSize ||
      direction.y + tilePos.y < 0
    )
      return null;
    const tmp = array2D[tilePos.x + direction.x][tilePos.y + direction.y];
    array2D[tilePos.x + direction.x][tilePos.y + direction.y] =
      array2D[tilePos.x][tilePos.y];
    array2D[tilePos.x][tilePos.y] = tmp;
    return array2D;
  }
  /**
   * @output create new instance of Node class with the params of each element in childs
   */
  wakeUpChilds() {
    this.childs = this.childs.map(
      (l) => new Node(l[0], l[1], l[2], this.goal, this, l[3])
    );
  }
  /**
   * @returns {boolean} check if the current node is the final target we looking for
   */
  checkIfFinal() {
    return this.hash == this.toHash(this.goal);;
  }
}
