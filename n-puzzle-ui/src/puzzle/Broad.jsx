import React, { useState, useEffect } from "react";

import SinglePuzzle from "./SinglePuzzle";
import SolutionTable from "./SolutionTable";

import { movePiece } from "./utils/movePiece";
import { addOrRemove, PuzzleGenerator, generateGoal } from "./utils";
import SolvingOptions from "./SolvingOptions";
import Generator from "./Generator";

const { log } = console;
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
export default function PuzzleBoard({}) {
  const [worker, initWorker] = useState(undefined);
  const [puzzle, setPuzzle] = useState([]);
  const [goal, setGoal] = useState("snail");
  const [size, setSize] = useState(3);
  const [qType, setQType] = useState("priorityQ");
  const [solvability, setSolvability] = useState(true);
  const [play, isPlay] = useState({
    states: [],
    playIt: false,
    idx: 0,
  });
  const [solution, setSolution] = useState();
  const [solvingOptions, updateSolvingOptions] = useState({
    heuristics: ["linearConflicts"],
    greedy: false,
    uniform: false,
  });
  const [expanded, setExpanded] = useState({
    import: false,
    generate: false,
    solver: true,
  });

  useEffect(() => {
    isPlay((prev) => ({ ...prev, playIt: false }));
    setSolution(undefined);
    if (
      puzzle.length &&
      (typeof puzzle[0][0] === "string" || puzzle[0][0] instanceof String)
    )
      setPuzzle(puzzle.map((l) => l.map((c) => parseInt(c))));
  }, [puzzle]);

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
      // playSolution();
    }
    return;
  }, [solution]);

  useEffect(() => {
    setPuzzle(
      new PuzzleGenerator(size, goal, true, 1000).map((l) =>
        l.map((c) => parseInt(c))
      )
    );
  }, [size, goal]);

  useEffect(() => {
    if (worker) {
      worker.onmessage = (e) => {
        setSolution(e.data);
        isPlay({
          states: e.data.steps,
          playIt: true,
          idx: 0,
        });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worker]);

  function onMovePiece(i, j) {
    log( play.playIt ? play.states[play.idx][0] : puzzle)
     const newPuzzle = movePiece(
      i,
      j,
      false,
      play.playIt ? play.states[play.idx][0].map(r => r.map(c => parseInt(c))) : puzzle
    );
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
              puzzle={(play.playIt && play?.states?.[play.idx][0]) || puzzle}
              onMovePiece={onMovePiece}
              complete={false}
            />
            {solution && play.playIt && (
              <div style={{ display: "flex" }}>
                <button
                  className="confButton"
                  style={{ margin: "auto" }}
                  onClick={() =>
                    isPlay((prev) => ({
                      ...prev,
                      idx: prev.idx > 0 ? prev.idx - 1 : 0,
                    }))
                  }
                >
                  Prev
                </button>
                <p>
                  {play.idx + 1}/{play.states.length}
                </p>
                <button
                className="confButton"
                  style={{ margin: "auto" }}
                  onClick={() =>
                    isPlay((prev) => ({
                      ...prev,
                      idx:
                        prev.idx < play.states.length - 1
                          ? prev.idx + 1
                          : prev.idx,
                    }))
                  }
                >
                  Next
                </button>
              </div>
            )}
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
