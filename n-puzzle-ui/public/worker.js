/* eslint-disable no-undef */

/* eslint-disable no-restricted-globals */
self.importScripts("npuzzle-bundle.js")
const { Node, Solver } = self.npuzzle.obj

self.onmessage = (e) => {
  let data = e.data;

  const initPuzz = new Node(...data.initPuzzleNode)
  const solver = new Solver(data.qType)
  data.acknowledged = true;

  if (solver.checkSolvability(initPuzz.puzzle, initPuzz.goal)) {
    solver[`start_${data.algorithm}`](Infinity, initPuzz).then((solution) => {
      self.postMessage(solution)
    })

  } else {
    console.log()
    self.postMessage({ error: `unsolvable puzzle to ${data.goal} state, try change the goal or the puzzle itself. ` });
  }

};

