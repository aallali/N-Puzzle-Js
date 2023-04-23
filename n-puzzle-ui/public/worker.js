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

    solver[`start_${data.algorithm}`](data.goal.length == 3 ? Infinity : 200000, initPuzz).then((solution) => {
      if (!solution || solution == -1)
        self.postMessage({ error: `sorry couldnt reach a solution for this, this is highly due to deep recursion/iteration limit (200000), you still can open an issue about it on github repo. including the exact puzzle and search options chosen to optimize the algorithm.` });
      else
        self.postMessage(solution)
    })

  } else {
    self.postMessage({ error: `[unsolvable puzzle to ${data.goal} state, try change the goal or the puzzle itself.]` });
  }

};

