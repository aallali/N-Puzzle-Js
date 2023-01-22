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
   * @output print puzzle to terminal
   */
  show() {
    const score = this.score;
    let line = "";
    log("================");
    const map = this.puzzle;
    let size = map.length;

    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map.length; j++) {
        line +=
          " " +
          map[i][j] +
          " ".repeat((size * size).toString().length - map[i][j].length) +
          " ";
        if (score != undefined && i == map.length - 1 && j == map.length - 1)
          line += "\x1b[33m  score: " + score + "\x1b[0m";
      }
      log(line);
      line = "";
    }
    log("================");
  }
  /**
   * 
   * @param {string} heuristic 
   * @returns score value of current puzzle using algo of heuristic given.
   */
  calculateScore(heuristics) {
    let score = 0;
    const heuristicsFunctions = {
      "manhattan": this.heuristic_manhattan.bind(this),
      "linearConflicts": () => this.heuristic_manhattan() + 2 * this.heuristic_linear_conflicts()
    }
    heuristics.forEach(heuristic => {
      score += heuristicsFunctions[heuristic]()
    });

    return score;
  }
  heuristic_manhattan() {
    let distance = 0;
    const size = this.puzzle.length;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const currentTile = this.puzzle[i][j];
        const tileInGoal = this.findindexOf(this.goal, currentTile);
        let d1 = Math.abs(i - tileInGoal.x);
        let d2 = Math.abs(j - tileInGoal.y);
        distance += + d1 + d2;
      }
    }
    return distance
  }
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
        if (currI.x === currJ.x && targI.x === targJ.x) {
          if ((currI.y < currJ.y && targI.y > targJ.y) || (currI.y > currJ.y && targI.y < targJ.y)) {
            conflicts++;
          }
        }
        if (currI.y === currJ.y && targI.y === targJ.y) {
          if ((currI.x < currJ.x && targI.x > targJ.x) || (currI.x > currJ.x && targI.x < targJ.x)) {
            conflicts++;
          }
        }
      }
    }
    return conflicts;
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
