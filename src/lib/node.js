const { log } = console;

export default class Node {
  constructor(puzzle, greedy, uniform, goal, parent, heuristic) {
    this.puzzle = puzzle;
    this.treeLevel = greedy
      ? 0
      : (parent === undefined ? -1 : parent.treeLevel) + 1;
    this.hash = this.toHash(this.puzzle);
    this.parent = parent && {
      parent: parent.parent,
      puzzle: parent.puzzle,
      score: parent.score
    };

    this.goal = goal;
    this.isFinal = this.checkIfFinal();
    this.childs = [];
    this.score = uniform ? 0 : this.treeLevel + this.calculateScore(heuristic);

    this.genChilds(uniform, greedy, heuristic);
  }

  toHash(twoDarray) {
    return (twoDarray || this.puzzle).map((row) => row.join(".")).join(".");
  }

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
  calculateScore(heuristic) {
    // manhattan
    let score = 0;
    const size = this.puzzle.length;

    switch (heuristic) {
      case "manhattan":
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            const currentTile = this.puzzle[i][j];
            const tileInGoal = this.findindexOf(this.goal, currentTile);
            let d1 = Math.abs(i - tileInGoal.x);
            let d2 = Math.abs(j - tileInGoal.y);
            score = score + d1 + d2;
          }
        }
        break;
      default:
        break;
    }

    return score;
  }

  genChilds(u, g, heuristic) {
    const moves = {
      right: { x: 0, y: 1 },
      up: { x: -1, y: 0 },
      left: { x: 0, y: -1 },
      down: { x: 1, y: 0 },
    };
    const zeroIdx = this.findindexOf(this.puzzle, "0");
    for (const dir in moves) {
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

  findindexOf(arr2D, trgt) {
    const size = arr2D.length;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (arr2D[i][j] == trgt) return { x: i, y: j };
      }
    }
  }

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

  wakeUpChilds() {
    this.childs = this.childs.map(
      (l) => new Node(l[0], l[1], l[2], this.goal, this, l[3])
    );
  }

  checkIfFinal() {
    return this.hash == this.toHash(this.goal);;
  }
}
