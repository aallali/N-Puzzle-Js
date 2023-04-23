(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.npuzzle = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.obj = exports.default = void 0;
var _node = _interopRequireDefault(require("./lib/node"));
var _solver = _interopRequireDefault(require("./lib/solver"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const obj = {
  Node: _node.default,
  Solver: _solver.default
};
exports.obj = obj;
var _default = obj;
exports.default = _default;

},{"./lib/node":3,"./lib/solver":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _heapq = _interopRequireDefault(require("heapq"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class HeapQueue {
  constructor() {
    this.items = [];
    this.maxOpen = 0;
    this.cmp = function (x, y) {
      return x.score < y.score;
    };
  }
  enqueue(elem) {
    _heapq.default.push(this.items, elem, this.cmp);
    if (this.items.length > this.maxOpen) this.maxOpen = this.items.length;
  }
  dequeue() {
    return this.isEmpty() ? undefined : this.items.shift();
  }
  isEmpty() {
    return !this.items.length;
  }
}
exports.default = HeapQueue;

},{"heapq":15}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utils = require("../utils");
class Node {
  constructor(puzzle, greedy, uniform, goal, parent, heuristics) {
    this.puzzle = puzzle;
    this.greedy = greedy;
    this.uniform = uniform;
    this.treeLevel = 0;
    this.goal = goal;
    this.hash = this.toHash(this.puzzle);
    this.isFinal = this.checkIfFinal();
    this.parent = parent;
    this.heuristics = heuristics;
    this.score = 0;
    this.initNode();
  }
  initNode() {
    if (!this.greedy) {
      if (this.parent === undefined) this.treeLevel = 0;else this.treeLevel = this.parent.treeLevel + 1;
    }
    this.parent = this.parent && {
      parent: this.parent.parent,
      puzzle: this.parent.puzzle,
      g: this.parent.treeLevel,
      h: this.parent.h
    };
    this.childs = [];
    this.h = this.uniform ? 0 : this.calculateScore(this.heuristics);
    this.score = this.treeLevel + this.h;
    this.genChilds(this.uniform, this.greedy, this.heuristics);
  }
  toHash(twoDarray) {
    return (twoDarray || this.puzzle).map(row => row.join(".")).join(".");
  }
  calculateScore(heuristics) {
    let score = 0;
    let ready_scores = this.heuristics_in_one_loop();
    const heuristicsFunctions = {
      manhattan: () => ready_scores.manhattan,
      linearConflicts: () => ready_scores.manhattan * 1.5 + this.heuristic_linear_conflicts(),
      hamming: () => ready_scores.hamming,
      euclidean: () => ready_scores.euclidean,
      diagonal: () => ready_scores.diagonal,
      gaschnig: () => this.heuristic_gaschnig()
    };
    heuristics.forEach(heuristic => {
      score += heuristicsFunctions[heuristic]();
    });
    return score;
  }
  heuristics_in_one_loop() {
    let manhattan = 0;
    let hamming = 0;
    let euclidean = 0;
    let diagonal = 0;
    const size = this.puzzle.length;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const currentTile = this.puzzle[i][j];
        const tileInGoal = (0, _utils.findIndexOf)(this.goal, currentTile);
        const mirrorInGoal = this.goal[i][j];
        if (currentTile != "0") try {
          let d1 = Math.abs(i - tileInGoal.x);
          let d2 = Math.abs(j - tileInGoal.y);
          if (currentTile != mirrorInGoal) hamming += currentTile != mirrorInGoal ? 1 : 0;
          manhattan += d1 + d2;
          euclidean += Math.sqrt(d1 ** 2 + d2 ** 2);
          diagonal += Math.max(d1, d2);
        } catch (err) {
          throw err;
        }
      }
    }
    const tff = f => parseFloat(f.toFixed(4));
    euclidean = tff(euclidean);
    manhattan = tff(manhattan);
    return {
      manhattan,
      hamming,
      euclidean,
      diagonal
    };
  }
  heuristic_linear_conflicts() {
    let conflicts = 0;
    const size = this.puzzle.length;
    const values = size * size;
    for (let i = 1; i < values - 1; i++) {
      for (let j = 2; j < values; j++) {
        const currI = (0, _utils.findIndexOf)(this.puzzle, i);
        const currJ = (0, _utils.findIndexOf)(this.puzzle, j);
        const targI = (0, _utils.findIndexOf)(this.goal, i);
        const targJ = (0, _utils.findIndexOf)(this.goal, j);
        if (currI.x === currJ.x && targI.x === targJ.x) if (currI.y < currJ.y && targI.y > targJ.y || currI.y > currJ.y && targI.y < targJ.y) conflicts++;
        if (currI.y === currJ.y && targI.y === targJ.y) if (currI.x < currJ.x && targI.x > targJ.x || currI.x > currJ.x && targI.x < targJ.x) conflicts++;
      }
    }
    return conflicts;
  }
  heuristic_gaschnig() {
    let score = 0;
    const currentMap = JSON.parse(JSON.stringify(this.puzzle));
    const goal = JSON.parse(JSON.stringify(this.goal));
    const goalHash = this.toHash(goal);
    while (this.toHash(currentMap) != goalHash) {
      const cmz = (0, _utils.findIndexOf)(currentMap, "0");
      if (goal[cmz.x][cmz.y] == "0") {
        for (let i = 0; i < this.puzzle.length; i++) for (let j = 0; j < this.puzzle.length; j++) if (currentMap[i][j] != goal[i][j]) {
          const tmp = currentMap[i][j];
          currentMap[i][j] = currentMap[cmz.x][cmz.y];
          currentMap[cmz.x][cmz.y] = tmp;
          break;
        }
      } else {
        const sv = goal[cmz.x][cmz.y];
        const ci = (0, _utils.findIndexOf)(currentMap, sv);
        const tmp = currentMap[cmz.x][cmz.y];
        currentMap[cmz.x][cmz.y] = currentMap[ci.x][ci.y];
        currentMap[ci.x][ci.y] = tmp;
      }
      score++;
    }
    return score;
  }
  genChilds(u, g, heuristic) {
    const moves = {
      right: {
        x: 0,
        y: 1
      },
      up: {
        x: -1,
        y: 0
      },
      left: {
        x: 0,
        y: -1
      },
      down: {
        x: 1,
        y: 0
      }
    };
    const zeroIdx = (0, _utils.findIndexOf)(this.puzzle, "0");
    for (const dir in moves) {
      const newPuzzle = this.moveTile(zeroIdx, moves[dir], JSON.parse(JSON.stringify(this.puzzle)));
      if (newPuzzle) {
        this.childs.push([newPuzzle, g, u, heuristic]);
      }
    }
  }
  moveTile(tilePos, direction, array2D) {
    const array2DSize = array2D.length;
    if (direction.x + tilePos.x >= array2DSize || direction.x + tilePos.x < 0 || direction.y + tilePos.y >= array2DSize || direction.y + tilePos.y < 0) return null;
    const tmp = array2D[tilePos.x + direction.x][tilePos.y + direction.y];
    array2D[tilePos.x + direction.x][tilePos.y + direction.y] = array2D[tilePos.x][tilePos.y];
    array2D[tilePos.x][tilePos.y] = tmp;
    return array2D;
  }
  wakeUpChilds() {
    this.childs = this.childs.map(l => new Node(l[0], l[1], l[2], this.goal, this, l[3]));
  }
  checkIfFinal() {
    return this.hash == this.toHash(this.goal);
  }
}
exports.default = Node;

},{"../utils":8}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class PriorityQueue {
  constructor() {
    this.items = [];
    this.maxOpen = 0;
  }
  enqueue(elem) {
    let contain = false;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].score > elem.score) {
        this.items.splice(i, 0, elem);
        contain = true;
        break;
      }
    }
    if (!contain) {
      this.items.push(elem);
    }
    if (this.items.length > this.maxOpen) this.maxOpen = this.items.length;
  }
  dequeue() {
    return this.isEmpty() ? undefined : this.items.shift();
  }
  isEmpty() {
    return this.items.length == 0;
  }
}
exports.default = PriorityQueue;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _priorityQueue = _interopRequireDefault(require("./priorityQueue"));
var _heapQueue = _interopRequireDefault(require("./heapQueue"));
var _bloomfilter = require("bloomfilter");
var _utils = require("../utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Solver {
  constructor(queueType) {
    this.visited = [];
    this.queue = [];
    this.queueType = queueType;
    this.solution = null;
    this.isSolvable = false;
    this.stats = {
      count: 0,
      time: 0
    };
  }
  resetProps(firstElement) {
    this.visited = new _bloomfilter.BloomFilter(32 * 1024 * 40000, 32);
    if (this.queueType == "heapQ") this.queue = new _heapQueue.default();else if (this.queueType == "priorityQ") this.queue = new _priorityQueue.default();else throw Error(`Please enter correct queue Type ["heapQ", "priorityQ"]`);
    this.solution = null;
    this.stats = {
      count: 0,
      time: new Date()
    };
    if (firstElement) {
      this.queue.enqueue(firstElement);
    }
  }
  checkSolvability(currentState, targetState) {
    return (0, _utils.is_solvable)(currentState, targetState, currentState.length);
  }
  buildScenario() {
    let steps = [];
    while (this.solution) {
      steps.push([this.solution.puzzle, this.solution.h, this.solution.g || this.solution.treeLevel]);
      this.solution = this.solution.parent;
    }
    steps = steps.reverse();
    this.getTheSteps(steps);
    return steps;
  }
  getTheSteps(steps) {
    const moves = {
      "01": "R",
      "-10": "U",
      "0-1": "L",
      "10": "D"
    };
    for (let i = 1; i < steps.length; i++) {
      const [s1, s2] = [steps[i][0], steps[i - 1][0]];
      const [e1, e2] = [(0, _utils.findIndexOf)(s1, "0"), (0, _utils.findIndexOf)(s2, "0")];
      steps[i][3] = moves[`${e1.x - e2.x}${e1.y - e2.y}`];
    }
  }
  async start_ASTAR(max_iter = +Infinity, firstNode) {
    this.resetProps(firstNode);
    function _logic() {
      while (!this.solution && !this.queue.isEmpty()) {
        if (this.stats.count > max_iter) {
          return -1;
        }
        const currentPuzzle = this.queue.dequeue();
        this.visited.add(currentPuzzle.hash);
        this.stats.count++;
        if (currentPuzzle.isFinal) {
          this.solution = currentPuzzle;
          break;
        }
        currentPuzzle.wakeUpChilds();
        for (let i = 0; i < currentPuzzle.childs.length; i++) {
          const child = currentPuzzle.childs[i];
          if (!this.visited.test(child.hash)) {
            this.visited.add(child.hash);
            this.queue.enqueue(child);
          }
        }
      }
      const steps = this.buildScenario();
      return {
        steps,
        cTime: this.stats.count,
        cSize: this.queue.maxOpen,
        time: new Date() - this.stats.time
      };
    }
    const result = _logic.bind(this)();
    this.resetProps();
    return result;
  }
  async start_BFS(max_iter = +Infinity, firstNode) {
    firstNode.greedy = false;
    firstNode.uniform = true;
    firstNode.initNode();
    return this.start_ASTAR(max_iter, firstNode);
  }
  async start_DFS(max_iter = Infinity, firstNode) {
    this.resetProps(firstNode);
    async function _logic(max_iter, firstNode) {
      this.visited.add(firstNode.hash);
      if (this.stats.count > max_iter) {
        return -1;
      }
      this.stats.count++;
      if (firstNode.isFinal) {
        this.solution = firstNode;
        return {
          steps: this.buildScenario(),
          cTime: this.stats.count,
          cSize: this.queue.maxOpen,
          time: new Date() - this.stats.time
        };
      }
      firstNode.wakeUpChilds();
      firstNode.childs.sort((a, b) => a.score - b.score);
      for (let i = 0; i < firstNode.childs.length; i++) {
        const child = firstNode.childs[i];
        if (!this.visited.test(child.hash)) {
          const res = await _logic.bind(this)(max_iter, child);
          if (res != null) return res;
        }
      }
      return null;
    }
    const result = await _logic.bind(this)(max_iter, firstNode);
    this.resetProps();
    return result;
  }
}
exports.default = Solver;

},{"../utils":8,"./heapQueue":2,"./priorityQueue":4,"bloomfilter":14}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function findindexOf(arr2D, trgt) {
  const size = arr2D.length;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (arr2D[i][j] == trgt) return {
        x: i,
        y: j
      };
    }
  }
}
var _default = findindexOf;
exports.default = _default;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.generateSnailGoalPuzzle = generateSnailGoalPuzzle;
exports.generateZeroFirstGoal = generateZeroFirstGoal;
exports.generateZeroLastGoal = generateZeroLastGoal;
function covertTo2dArr(arr, size) {
  let result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
function generateSnailGoalPuzzle(size) {
  let proto = new Array(size * size).fill(0);
  let row = 0;
  let col = 0;
  let rowInc = -1;
  let colInc = 1;
  let inc = 1;
  while (inc < size * size) {
    rowInc *= -1;
    while (colInc == 1 && col < size && !proto[row * size + col] || colInc == -1 && col >= 0 && !proto[row * size + col]) {
      proto[row * size + col] = inc;
      col += colInc;
      inc++;
    }
    if (colInc == 1) {
      col -= 1;
      row++;
    } else {
      col += 1;
      row--;
    }
    while (rowInc == 1 && row < size && !proto[row * size + col] || rowInc == -1 && row >= 0 && !proto[row * size + col]) {
      proto[row * size + col] = inc;
      row += rowInc;
      inc++;
    }
    if (colInc == 1) col--;else col++;
    if (rowInc == 1) row--;else row++;
    colInc *= -1;
  }
  return covertTo2dArr(proto.join().split(","), size);
}
function generateZeroFirstGoal(size) {
  let arr = [];
  let row = [];
  for (let x = 0; x < size; x++) {
    row = [];
    for (let i = 0; i < size; i++) row.push((i + x * size).toString());
    arr.push(row);
  }
  return arr;
}
function generateZeroLastGoal(size) {
  let arr = [];
  let row = [];
  for (let x = 0; x < size; x++) {
    row = [];
    for (let i = 0; i < size; i++) row.push((1 + i + x * size).toString());
    arr.push(row);
  }
  arr[size - 1][size - 1] = "0";
  return arr;
}
var _default = {
  snail: generateSnailGoalPuzzle,
  zFirst: generateZeroFirstGoal,
  zLast: generateZeroLastGoal
};
exports.default = _default;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PuzzleGenerator", {
  enumerable: true,
  get: function () {
    return _puzzleGenerator.default;
  }
});
Object.defineProperty(exports, "blok", {
  enumerable: true,
  get: function () {
    return _timeBlok.default;
  }
});
Object.defineProperty(exports, "findIndexOf", {
  enumerable: true,
  get: function () {
    return _findIndexOf.default;
  }
});
Object.defineProperty(exports, "generateGoal", {
  enumerable: true,
  get: function () {
    return _goalGenerator.default;
  }
});
Object.defineProperty(exports, "is_solvable", {
  enumerable: true,
  get: function () {
    return _solvability.default;
  }
});
Object.defineProperty(exports, "parsePuzzle", {
  enumerable: true,
  get: function () {
    return _parsePuzzle.default;
  }
});
Object.defineProperty(exports, "printPuzzle", {
  enumerable: true,
  get: function () {
    return _puzzlePrinter.default;
  }
});
var _parsePuzzle = _interopRequireDefault(require("./parsePuzzle.js"));
var _goalGenerator = _interopRequireDefault(require("./goalGenerator.js"));
var _puzzlePrinter = _interopRequireDefault(require("./puzzlePrinter"));
var _timeBlok = _interopRequireDefault(require("./timeBlok"));
var _puzzleGenerator = _interopRequireDefault(require("./puzzleGenerator"));
var _solvability = _interopRequireDefault(require("./solvability"));
var _findIndexOf = _interopRequireDefault(require("./findIndexOf"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./findIndexOf":6,"./goalGenerator.js":7,"./parsePuzzle.js":9,"./puzzleGenerator":10,"./puzzlePrinter":11,"./solvability":12,"./timeBlok":13}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const FILE_NOT_EXIST = "FILE_NOT_EXIST";
const DIFFERS_ROWS_AND_COLUMNS = "DIFFERS_ROWS_AND_COLUMNS";
const EMPTY_FILE = "EMPTY_FILE";
const EMPTY_ROW = "EMPTY_ROW";
const INVALID_ROW = "INVALID_ROW";
const INVALID_DIMENSION = "INVALID_DIMENSION";
const WRONG_NUMBER_ROWS = "WRONG_NUMBER_ROWS";
const WRONG_NUMBER_COLS = "WRONG_NUMBER_COLS";
const LOW_DIMENSION = "LOW_DIMENSION";
const NO_LAST_EMPTY_LINE = "NO_LAST_EMPTY_LINE";
const TOO_LARGE_NUMBER = "TOO_LARGE_NUMBER";
const HAS_DUPLICATES = "HAS_DUPLICATES";
const errorMessages = (key, message) => {
  switch (key) {
    case FILE_NOT_EXIST:
      return `File ${message} not exist`;
    case DIFFERS_ROWS_AND_COLUMNS:
      return "Number of rows differs from number of columns";
    case EMPTY_FILE:
      return "Empty file is not allowed";
    case EMPTY_ROW:
      return "Empty row is not allowed. Please remove all empty rows in a file";
    case INVALID_ROW:
      return `Invalid row ${message}. Please use only digits or comment in the end of the row`;
    case INVALID_DIMENSION:
      return `Please use only one number for dimension, ${message} invalid`;
    case WRONG_NUMBER_ROWS:
      return "Dimension not equal number of rows";
    case WRONG_NUMBER_COLS:
      return "Dimension not equal number of cols";
    case LOW_DIMENSION:
      return "Dimension is too low, should be greater than 3";
    case NO_LAST_EMPTY_LINE:
      return "Please add empty line to the end of the file";
    case TOO_LARGE_NUMBER:
      return `${message} is too large number for this type of field`;
    case HAS_DUPLICATES:
      return `Field has duplicate number ${message}, please use unique numbers`;
    default:
      return `this key : (${key}) is not defined`;
  }
};
const error = (key, message = "") => {
  const errorMessage = errorMessages(key, message);
  return errorMessage;
};
const validateFile = fileTxt => {
  try {
    const fileStr = fileTxt;
    if (fileStr.length === 0) {
      return error(EMPTY_FILE);
    }
    const splitedStr = fileStr.split("\n");
    splitedStr.forEach((row, index) => {
      if (row.length === 0 && index !== splitedStr.length - 1) {
        return error(EMPTY_ROW);
      }
      if (index === splitedStr.length - 1 && row.length > 0) {
        return error(NO_LAST_EMPTY_LINE);
      }
    });
    let dimension = undefined;
    let fileInfo = fileStr.replace(/#.+($|\n)/g, "$1").split("\n").filter(row => row.length > 0).map((row, index) => {
      if (index === 0) {
        dimension = Number(row);
        if (!dimension) {
          throw error(INVALID_DIMENSION, row);
        }
        if (dimension < 3) {
          throw error(LOW_DIMENSION);
        }
      }
      if (index === 0 && !/[0-9]*/.test(row)) {
        throw error(INVALID_ROW, row);
      }
      return row.split(/\s+/g).filter(x => x.length).map(cell => {
        if (index > 0 && /[^0-9]/.test(cell)) {
          throw error(INVALID_ROW, row);
        }
        const number = Number(cell);
        if (number > dimension * dimension - 1) {
          throw error(TOO_LARGE_NUMBER, number);
        }
        return number;
      });
    });
    if (fileInfo.length - 1 !== dimension) {
      throw error(WRONG_NUMBER_ROWS);
    }
    let array = [];
    for (let i = 1; i < fileInfo.length; i++) {
      if (fileInfo[i].length !== dimension) {
        throw error(WRONG_NUMBER_COLS);
      }
      array = [...array, ...fileInfo[i]];
    }
    const duplicate = hasDuplicates(array);
    if (duplicate !== undefined) {
      throw error(HAS_DUPLICATES, duplicate);
    }
    fileInfo.shift();
    return {
      valid: true,
      puzzle: fileInfo
    };
  } catch (error) {
    return {
      valid: false,
      error
    };
  }
};
const hasDuplicates = array => array.find((element, index) => array.indexOf(element) !== index);
var _default = validateFile;
exports.default = _default;

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _goalGenerator = _interopRequireDefault(require("./goalGenerator"));
var _solvability = _interopRequireDefault(require("./solvability"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class PuzzleGenerator {
  constructor(size = 3, goal, solvable = false, iterations = 10) {
    this.goal = _goalGenerator.default[goal](size);
    this.iterations = iterations;
    return this.shuffle(solvable);
  }
  shuffle(solv) {
    const multArr = JSON.parse(JSON.stringify(this.goal));
    let iters = this.iterations;
    while (iters) {
      for (let i = 0; i < multArr.length; i++) {
        for (let j = 0; j < multArr[i].length; j++) {
          let i1 = Math.floor(Math.random() * multArr.length);
          let j1 = Math.floor(Math.random() * multArr.length);
          [multArr[i][j], multArr[i1][j1]] = [multArr[i1][j1], multArr[i][j]];
          iters--;
          if (iters <= 0) break;
        }
        if (iters <= 0) break;
      }
    }
    const isSolv = (0, _solvability.default)(multArr, this.goal, multArr[0].length);
    if (isSolv && solv || !isSolv && !solv) return multArr.map(r => r.map(c => parseInt(c)));
    return this.shuffle(solv);
  }
}
var _default = PuzzleGenerator;
exports.default = _default;

},{"./goalGenerator":7,"./solvability":12}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = printPuzzle;
function printPuzzle(puzzleMap, score) {
  const map = JSON.parse(JSON.stringify(puzzleMap));
  const {
    log
  } = console;
  let line = "";
  log("================");
  let size = map.length;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map.length; j++) {
      if (map[i][j] == '0') map[i][j] = '█';
      line += " " + map[i][j] + " ".repeat((size * size).toString().length - map[i][j].length) + ' ';
      if (score != undefined && i == map.length - 1 && j == map.length - 1) line += "\x1b[33m  score: " + score + "\x1b[0m";
    }
    log(line);
    line = '';
  }
  log("================");
}

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const EMPTY_TILE = 0;
function count_inversions(puzzle, solved, size) {
  let res = 0;
  for (let i = 0; i < size ** 2; i++) {
    for (let j = i + 1; j < size ** 2; j++) {
      const [vi, vj] = [puzzle[i], puzzle[j]];
      if (solved.indexOf(vi) > solved.indexOf(vj)) res++;
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
    taxicab = Math.abs(puzzle_zero_row - solved_zero_row) + Math.abs(puzzle_zero_column - solved_zero_column);
  if (taxicab % 2 == 0 && inversions % 2 == 0) return true;
  if (taxicab % 2 == 1 && inversions % 2 == 1) return true;
  return false;
}
var _default = is_solvable;
exports.default = _default;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = blok;
function blok(s) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, s * 1000);
  });
}

},{}],14:[function(require,module,exports){
(function(exports) {
  exports.BloomFilter = BloomFilter;
  exports.fnv_1a = fnv_1a;

  var typedArrays = typeof ArrayBuffer !== "undefined";

  // Creates a new bloom filter.  If *m* is an array-like object, with a length
  // property, then the bloom filter is loaded with data from the array, where
  // each element is a 32-bit integer.  Otherwise, *m* should specify the
  // number of bits.  Note that *m* is rounded up to the nearest multiple of
  // 32.  *k* specifies the number of hashing functions.
  function BloomFilter(m, k) {
    var a;
    if (typeof m !== "number") a = m, m = a.length * 32;

    var n = Math.ceil(m / 32),
        i = -1;
    this.m = m = n * 32;
    this.k = k;

    if (typedArrays) {
      var kbytes = 1 << Math.ceil(Math.log(Math.ceil(Math.log(m) / Math.LN2 / 8)) / Math.LN2),
          array = kbytes === 1 ? Uint8Array : kbytes === 2 ? Uint16Array : Uint32Array,
          kbuffer = new ArrayBuffer(kbytes * k),
          buckets = this.buckets = new Int32Array(n);
      if (a) while (++i < n) buckets[i] = a[i];
      this._locations = new array(kbuffer);
    } else {
      var buckets = this.buckets = [];
      if (a) while (++i < n) buckets[i] = a[i];
      else while (++i < n) buckets[i] = 0;
      this._locations = [];
    }
  }

  // See http://willwhim.wpengine.com/2011/09/03/producing-n-hash-functions-by-hashing-only-once/
  BloomFilter.prototype.locations = function(v) {
    var k = this.k,
        m = this.m,
        r = this._locations,
        a = fnv_1a(v),
        b = fnv_1a(v, 1576284489), // The seed value is chosen randomly
        x = a % m;
    for (var i = 0; i < k; ++i) {
      r[i] = x < 0 ? (x + m) : x;
      x = (x + b) % m;
    }
    return r;
  };

  BloomFilter.prototype.add = function(v) {
    var l = this.locations(v + ""),
        k = this.k,
        buckets = this.buckets;
    for (var i = 0; i < k; ++i) buckets[Math.floor(l[i] / 32)] |= 1 << (l[i] % 32);
  };

  BloomFilter.prototype.test = function(v) {
    var l = this.locations(v + ""),
        k = this.k,
        buckets = this.buckets;
    for (var i = 0; i < k; ++i) {
      var b = l[i];
      if ((buckets[Math.floor(b / 32)] & (1 << (b % 32))) === 0) {
        return false;
      }
    }
    return true;
  };

  // Estimated cardinality.
  BloomFilter.prototype.size = function() {
    var buckets = this.buckets,
        bits = 0;
    for (var i = 0, n = buckets.length; i < n; ++i) bits += popcnt(buckets[i]);
    return -this.m * Math.log(1 - bits / this.m) / this.k;
  };

  // http://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetParallel
  function popcnt(v) {
    v -= (v >> 1) & 0x55555555;
    v = (v & 0x33333333) + ((v >> 2) & 0x33333333);
    return ((v + (v >> 4) & 0xf0f0f0f) * 0x1010101) >> 24;
  }

  // Fowler/Noll/Vo hashing.
  // Nonstandard variation: this function optionally takes a seed value that is incorporated
  // into the offset basis. According to http://www.isthe.com/chongo/tech/comp/fnv/index.html
  // "almost any offset_basis will serve so long as it is non-zero".
  function fnv_1a(v, seed) {
    var a = 2166136261 ^ (seed || 0);
    for (var i = 0, n = v.length; i < n; ++i) {
      var c = v.charCodeAt(i),
          d = c & 0xff00;
      if (d) a = fnv_multiply(a ^ d >> 8);
      a = fnv_multiply(a ^ c & 0xff);
    }
    return fnv_mix(a);
  }

  // a * 16777619 mod 2**32
  function fnv_multiply(a) {
    return a + (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24);
  }

  // See https://web.archive.org/web/20131019013225/http://home.comcast.net/~bretm/hash/6.html
  function fnv_mix(a) {
    a += a << 13;
    a ^= a >>> 7;
    a += a << 3;
    a ^= a >>> 17;
    a += a << 5;
    return a & 0xffffffff;
  }
})(typeof exports !== "undefined" ? exports : this);

},{}],15:[function(require,module,exports){
'use strict';

//
//                 0
//         1               2
//
//    3        4       5        6
//
// 7     8  9    10 11   12  13   14
//

var heapq = exports;

var cmplt = function(x, y) {
  return x < y;
};

// push an item into heap, O(log n)
heapq.push = function(heap, item, cmp) {
  heap.push(item);
  siftdown(heap, 0, heap.length - 1, cmp || cmplt);
};

// pop the smallest item from heap, O(log n)
heapq.pop = function(heap, cmp) {
  if (heap.length > 0) {
    var last = heap.pop();

    if (heap.length > 0) {
      var head = heap[0];
      heap[0] = last;
      siftup(heap, 0, cmp || cmplt);
      return head;
    } else {
      return last;
    }
  }
};

// get the top item, O(1)
heapq.top = function(heap) {
  if (heap.length !== 0)
    return heap[0];
};

// push an item on the heap and pop out the top item,
// this runs more efficiently than `heapq.push()` followed
// by a separate call to `heapq.pop()`, O(log n)
heapq.pushpop = function(heap, item, cmp) {
  cmp = cmp || cmplt;

  if (heap.length > 0 && cmp(heap[0], item)) {
    var temp = heap[0];
    heap[0] = item;
    item = temp;
    siftup(heap, 0, cmp);
  }
  return item;
};

// transform array `heap` into a heap in-place, O(nlog n)
heapq.heapify = function(arr, cmp) {
  cmp = cmp || cmplt;

  for (var idx = Math.floor(arr.length / 2) - 1;
       idx >= 0; --idx)
    siftup(arr, idx, cmp);
  return arr;
};

// heap sort, O(nlog n)
heapq.heapsort = function(arr, cmp) {
  var heap = [];

  for (var i = 0; i < arr.length; ++i)
    heapq.push(heap, arr[i], cmp);

  var arr_ = [];

  while (heap.length > 0)
    arr_.push(heapq.pop(heap, cmp));
  return arr_;
};

function siftdown(heap, startIdx, idx, cmp) {
  var item = heap[idx];

  while (idx > startIdx) {
    var parentIdx = (idx - 1) >> 1;
    var parentItem = heap[parentIdx];
    if (cmp(item, parentItem)) {
      heap[idx] = parentItem;
      idx = parentIdx;
      continue;
    }
    break;
  }

  heap[idx] = item;
}

function siftup(heap, idx, cmp) {
  var endIdx = heap.length;
  var startIdx = idx;
  var item = heap[idx];

  var childIdx = idx * 2 + 1;

  while (childIdx < endIdx) {
    var rightIdx = childIdx + 1;

    if (rightIdx < endIdx && (!cmp(
      heap[childIdx], heap[rightIdx]))) {
      childIdx = rightIdx;
    }
    heap[idx] = heap[childIdx];
    idx = childIdx;
    childIdx =  idx * 2 + 1;
  }

  heap[idx] = item;
  siftdown(heap, startIdx, idx, cmp);
}

},{}]},{},[1])(1)
});
