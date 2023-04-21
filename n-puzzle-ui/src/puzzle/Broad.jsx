/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";

import SinglePuzzle from "./SinglePuzzle";
import SolutionTable from "./SolutionTable";

import { movePiece } from "./utils/movePiece";
import {
  addOrRemove,
  PuzzleGenerator,
  generateGoal,
  parsePuzzleText,
} from "./utils";
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
function toHash(twoDarray) {
  return twoDarray.map((row) => row.join(".")).join(".");
}
export default function PuzzleBoard() {
  const [worker, initWorker] = useState(undefined);
  const [puzzle, setPuzzle] = useState([]);
  const [puzzleText, setPuzzTxt] = useState(defaultPuzzlTxt);
  const [solvability, setSolvability] = useState(true);
  const [complete, updateComplete] = useState(false);
  const [play, isPlay] = useState({
    states: [],
    playIt: false,
    idx: 0,
  });
  const [solution, setSolution] = useState();
  const [solvingOptions, updateSolvingOptions] = useState({
    algorithm: "ASTAR",
    heuristics: ["linearConflicts"],
    greedy: false,
    uniform: false,
    goal: "zFirst",
    size: 3,
    queueType: "priorityQ", // "heapQ" or "priorityQ"
  });
  const [solvOptionsClon, setSolvOptionsClon] = useState();

  const [expanded, setExpanded] = useState({
    import: false,
    generate: true,
    solver: true,
  });

  useEffect(() => {
    if (
      solvingOptions.uniform &&
      !solvingOptions.greedy &&
      solvingOptions.algorithm !== "BFS"
    )
      updateSolvingOptions((prev) => ({ ...prev, algorithm: "BFS" }));
  }, [solvingOptions.greedy, solvingOptions.uniform]);

  useEffect(() => {
    switch (solvingOptions.algorithm) {
      case "ASTAR":
        updateSolvingOptions((prev) => ({
          ...prev,
          greedy: false,
          uniform: false,
          queueType: "priorityQ",
        }));
        break;
      case "BFS":
        updateSolvingOptions((prev) => ({
          ...prev,
          greedy: false,
          uniform: true,
          queueType: "heapQ",
        }));
        break;
      case "DFS":
        updateSolvingOptions((prev) => ({
          ...prev,
          greedy: true,
          uniform: false,
          queueType: "priorityQ",
        }));
        break;
      default:
        updateSolvingOptions((prev) => ({
          ...prev,
          greedy: false,
          uniform: false,
          queueType: "priorityQ",
        }));
        break;
    }
  }, [solvingOptions.algorithm]);

  useEffect(() => {
    isPlay((prev) => ({ ...prev, playIt: false }));
    setSolution(undefined);

    if (
      puzzle.length &&
      (typeof puzzle[0][0] === "string" || puzzle[0][0] instanceof String)
    ) {
      setPuzzle(puzzle.map((l) => l.map((c) => parseInt(c))));
      updateComplete(toHash(puzzle) == toHash(solvingOptions.goal));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        solver: !!solution,
      }));
      // playSolution();
    }
    return;
  }, [solution]);

  useEffect(() => {
    setPuzzle(
      new PuzzleGenerator(
        solvingOptions.size,
        solvingOptions.goal,
        true,
        1000
      ).map((l) => l.map((c) => parseInt(c)))
    );
    updateSolvingOptions((prev) => ({ ...prev, algorithm: "ASTAR" }));
  }, [solvingOptions.size, solvingOptions.goal]);

  /**
   * run worker
   */
  useEffect(() => {
    if (worker) {
      worker.onmessage = (e) => {
        if (e.data.error) {
          alert(e.data.error);
          setSolvOptionsClon(undefined);
        } else {
          setSolution(e.data);
          isPlay({
            states: e.data.steps,
            playIt: true,
            idx: 0,
          });
          setSolvOptionsClon(solvingOptions);
          stopWorker();
        }
      };

      worker.postMessage({
        algorithm: solvingOptions.algorithm,
        goal: solvingOptions.goal,
        initPuzzleNode: [
          puzzle.map((l) => l.map((c) => c.toString())),
          solvingOptions.greedy,
          solvingOptions.uniform,
          generateGoal[solvingOptions.goal](solvingOptions.size),
          undefined,
          solvingOptions.heuristics,
        ],
        qType: solvingOptions.queueType,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worker]);

  function onMovePiece(e, i, j) {
    const newPuzzle = movePiece(
      i,
      j,
      false,
      play.playIt
        ? play.states[play.idx][0].map((r) => r.map((c) => parseInt(c)))
        : puzzle
    );

    if (newPuzzle) {
      setPuzzle(newPuzzle.puzzle);
      return newPuzzle.dir;
    }
  }
  async function runSolver() {
    if (worker) worker.terminate();
    setSolution(null);
    initWorker(new Worker("worker.js"));
  }
  function importPuzzleTxt() {
    const result = parsePuzzleText(puzzleText);
    if (result.valid) {
      setPuzzle(result.puzzle);
    } else alert(result.error);
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
              Import puzzle {!expanded.import && "(click)"}:
            </legend>
            {expanded.import ? (
              <div className="expanded">
                <div className="row">
                  <textarea
                    id="puzzleTxt"
                    name="puzzleTxt"
                    rows="12"
                    cols="40"
                    // defaultValue={puzzleText}
                    value={puzzleText}
                    onChange={(event) => setPuzzTxt(event.target.value)}
                  />
                </div>
                <div className="row">
                  <button className="confButton" onClick={importPuzzleTxt}>
                    Import
                  </button>
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
              Generate Puzzle {!expanded.generate && "(click)"}:
            </legend>
            <Generator
              expanded={expanded.generate}
              setSize={(v) =>
                updateSolvingOptions((prev) => ({
                  ...prev,
                  size: v,
                }))
              }
              size={solvingOptions.size}
              solvability={solvability}
              setSolvability={setSolvability}
              goal={solvingOptions.goal}
              setGoal={(v) =>
                updateSolvingOptions((prev) => ({
                  ...prev,
                  goal: v,
                }))
              }
              setPuzzle={setPuzzle}
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
                Solver {!expanded.solver && "(click)"}:
              </legend>
              <SolvingOptions
                expanded={expanded.solver}
                solvingOptions={solvingOptions}
                updateSolvingOptions={updateSolvingOptions}
                addOrRemove={addOrRemove}
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
                solvingOptions={solvOptionsClon}
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
            <div></div>

            {solution && play.playIt && (
              <>
                <p>Score g() + h(): {play.states[play.idx][1]}</p>
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
                  <p style={{ padding: 5 }}>
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
              </>
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
            puzzle={generateGoal[solvingOptions.goal](solvingOptions.size).map(
              (l) => l.map((c) => parseInt(c))
            )}
            onMovePiece={movePiece}
            complete={true}
          />
        </fieldset>
      </div>
    </div>
  );
}
