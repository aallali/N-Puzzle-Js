/* eslint-disable no-undef */

/* eslint-disable no-restricted-globals */
self.importScripts("npuzzle-bundle.js")
npuzzle = npuzzle.default
const { Node, Solver } = npuzzle
self.addEventListener("blockme", (e) => console.log(e));

self.onmessage =  (e) => {
 
  // setInterval(() => {
  //   localStorage.getItem("block")
  // }, 1000)

  let data = e.data;
  if(data.close)
  {
    console.log("closing ...")
    self.close()
    // console.log(self)
  } else {
    console.log("received a puzzle to solve , DAMN!!")

    const initPuzz = new Node(...data.initPuzzleNode)
    const solver = new Solver(initPuzz, data.qType)
    data.acknowledged = true;
    if (solver.isSolvable) {
      solver.start().then((solution) => self.postMessage(solution))
      
    } else {
      self.postMessage(null);
    }
  }




  // 
};

