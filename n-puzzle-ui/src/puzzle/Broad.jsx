import React, { useState, useEffect } from "react";

import SinglePuzzle from "./SinglePuzzle";
import SolutionTable from "./SolutionTable";

import { movePiece } from "./utils/movePiece";
import { addOrRemove, PuzzleGenerator, generateGoal } from "./utils";
import SolvingOptions from "./SolvingOptions";
import Generator from "./Generator";

// const { log } = console;

export default function PuzzleBoard({}) {
  const [worker, initWorker] = useState(undefined);
  const [puzzle, setPuzzle] = useState([]);
  const [goal, setGoal] = useState("snail");
  const [size, setSize] = useState(3);
  const [qType, setQType] = useState("priorityQ");
  const [solvability, setSolvability] = useState(true);
  const [complete, setComplete] = useState(false);
  const [solution, setSolution] = useState();
  const [solvingOptions, updateSolvingOptions] = useState({
    heuristics: ["linearConflicts"],
    greedy: false,
    uniform: false,
  });
  useEffect(() => {
    if (
      puzzle.length &&
      (typeof puzzle[0][0] === "string" || puzzle[0][0] instanceof String)
    )
      setPuzzle(puzzle.map((l) => l.map((c) => parseInt(c))));
  }, [puzzle]);
  const [expanded, setExpanded] = useState({
    import: false,
    generate: false,
    solver: true,
  });
  useEffect(() => {
    async function playSolution() {
      for (let i = 0; i < solution.steps.length; i++) {
        setPuzzle(solution.steps[i][0]);
        await new Promise((resolve) => setTimeout(() => resolve(), 500));
      }
    }

    if (solution) {
      setExpanded((prev) => ({
        ...prev,
        import: !solution,
        generate: !solution,
        solver: !solution,
      }));
      playSolution();
    }
    return 
  }, [solution]);

  useEffect(() => {
    setPuzzle(
      new PuzzleGenerator(size, goal, true, 1).map((l) =>
        l.map((c) => parseInt(c))
      )
    );
  }, [size, goal]);

  function onMovePiece(i, j) {
    const newPuzzle = movePiece(i, j, complete, puzzle);
    if (newPuzzle) {
      setPuzzle(newPuzzle);
    }
  }

  async function runSolver() {
    setSolution(null);
    initWorker(new Worker("worker.js"));
  }
  function stopWorker() {
    worker.terminate();
    initWorker(undefined);
  }
  useEffect(() => {
    if (worker) {
      worker.onmessage = (e) => {
        setSolution(e.data);
        console.log(e.data.steps[0]);

        worker.terminate();
        initWorker(undefined);
      };

      worker.postMessage({
        initPuzzleNode: [
          puzzle.map((l) => l.map((c) => c.toString())),
          solvingOptions.greedy,
          solvingOptions.uniform,
          generateGoal[goal](size),
          undefined,
          solvingOptions.heuristics,
        ],
        qType,
      });
    }
  }, [worker]);
  const defaultPuzzlTxt = `
# first line should contain the size of the puzzle
# write every row in a line
# separate numbers by space
# lines prevfixed with '#' are ignored
# example :
3
2 4 0
1 3 6
7 5 8
`;
  return (
    <div style={{ display: "flex" }}>
      <div className="container config">
        <div className="row">
          <fieldset>
            <legend
              onClick={() =>
                setExpanded((prev) => ({ ...prev, import: !prev.import }))
              }
            >
              Import puzzle {!expanded.import && "(clickme)"}:
            </legend>
            {expanded.import ? (
              <div className="expanded">
                <div className="row">
                  <textarea
                    id="puzzleTxt"
                    name="puzzleTxt"
                    rows="12"
                    cols="40"
                    defaultValue={defaultPuzzlTxt}
                  />
                </div>
                <div className="row">
                  <button className="confButton">Import</button>
                </div>
              </div>
            ) : null}
          </fieldset>
        </div>
        <div className="row">
          <fieldset>
            <legend
              onClick={() =>
                setExpanded((prev) => ({ ...prev, generate: !prev.generate }))
              }
            >
              Generate Puzzle {!expanded.generate && "(clickme)"}:
            </legend>
            <Generator
              expanded={expanded.generate}
              setSize={setSize}
              size={size}
              solvability={solvability}
              setSolvability={setSolvability}
              goal={goal}
              setGoal={setGoal}
              setPuzzle={setPuzzle}
              PuzzleGenerator={PuzzleGenerator}
            />
          </fieldset>
        </div>
        <div className="row">
          <div>
            <fieldset>
              <legend
                onClick={() =>
                  setExpanded((prev) => ({ ...prev, solver: !prev.solver }))
                }
              >
                Solver {!expanded.solver && "(clickme)"}:
              </legend>
              <SolvingOptions
                expanded={expanded.solver}
                solvingOptions={solvingOptions}
                updateSolvingOptions={updateSolvingOptions}
                addOrRemove={addOrRemove}
                setQType={setQType}
                runSolver={runSolver}
                stopSolver={stopWorker}
                worker={worker}
              />
            </fieldset>
          </div>
        </div>
        {solution ? (
          <div className="row">
            <div>
              <SolutionTable
                solution={solution}
                solvingOptions={solvingOptions}
                
              />
            </div>
          </div>
        ) : null}
      </div>
      <div className="container config">
        <fieldset>
          <legend>The Puzzle:</legend>

          <div style={{ borderRight: " gray" }}>
            <div
              style={{
                textAlign: "center",
                display: "block",
                margin: 14,
              }}
            >
              <p>
                Click a Tile around blank
                <br /> area to move it:
              </p>
            </div>
            <SinglePuzzle
              puzzle={puzzle}
              onMovePiece={onMovePiece}
              complete={false}
            />
          </div>
        </fieldset>
        <fieldset>
          <legend>Goal State:</legend>

          <div
            style={{
              textAlign: "center",
              display: "block",
              margin: 14,
            }}
          ></div>
          <SinglePuzzle
            puzzle={generateGoal[goal](size).map((l) =>
              l.map((c) => parseInt(c))
            )}
            onMovePiece={movePiece}
            complete={true}
          />
        </fieldset>
      </div>
    </div>
  );
}
