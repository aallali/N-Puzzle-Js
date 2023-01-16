const moves = {
  right: { x: 0, y: 1 }, // Right
  down: { x: -1, y: 0 }, // Down
  left: { x: 0, y: -1 }, // Left
  up: { x: 1, y: 0 }, // Up
};
class Node {
  constructor(puzzle, greedy, uniform, goal, parent, heuristic) {
    this.puzzle = puzzle;
    this.treeLevel = greedy ? 0 : (this.parent || -1) + 1;
    this.hash;
    this.parent = parent;
    this.goal = goal;
    this.isFinal;
    this.childs;

    this.score = uniform ? 0 : this.calculateScore(heuristic);

    this.toHash();
    this.checkIfFinal();
    this.genChilds(uniform, greedy, heuristic);
  }

  toHash(twoDarray) {
    this.hash = (twoDarray || this.puzzle)
      .map((row) => row.join("."))
      .join(".");
    return this.hash;
  }

  calculateScore(heuristic) {
    // manhattan
    let score = 0;
    switch (heuristic) {
      case "manhattan":
        score = 8;
        break;
      default:
        break;
    }

    return score;
  }

  genChilds(u, g, heuristic) {
    for (dir in moves) {
      
    }
  }

  getZeroIndx(arr2D) {
    const size = arr2D.length;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (arr2D[i[j]] == "0") return { x: i, y: j };
      }
    }
  }

  moveTile(tilePos, direction) {}

  checkIfFinal() {
    this.isFinal = this.hash == this.toHash(this.goal);
    return;
  }
}
