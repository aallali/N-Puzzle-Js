/* eslint-disable eqeqeq */
export default function SolvingOptions({
  expanded,
  solvingOptions,
  updateSolvingOptions,
  addOrRemove,
  runSolver,
  stopSolver,
  worker,
}) {
  return (
    <>
      {expanded ? (
        <>
          {(worker && (
            <button className="confButton" onClick={stopSolver}>
              Stop
            </button>
          )) || (
            <div className="expanded">
              <div>
                <b>Search Algorithm:</b>
                <select
                  name="algo"
                  id="algo"
                  value={solvingOptions.algorithm}
                  onChange={(e) =>
                    updateSolvingOptions((prev) => ({
                      ...prev,
                      algorithm: e.target.value,
                    }))
                  }
                >
                  <option value="ASTAR">A*</option>
                  {solvingOptions.size == 3 && (
                    <>
                      {" "}
                      <option value="BFS">BFS</option>
                      <option value="DFS">DFS</option>
                    </>
                  )}
                </select>
              </div>
              {!solvingOptions.uniform && solvingOptions.algorithm != "BFS" ? (
                <Heuristics
                  solvingOptions={solvingOptions}
                  updateSolvingOptions={updateSolvingOptions}
                  addOrRemove={addOrRemove}
                />
              ) : null}

              <AlgoOptions
                solvingOptions={solvingOptions}
                updateSolvingOptions={updateSolvingOptions}
              />

              <button className="confButton" onClick={runSolver}>
                Solve
              </button>
            </div>
          )}
        </>
      ) : null}
    </>
  );
}

function AlgoOptions({ solvingOptions, updateSolvingOptions }) {
  return (
    <>
      {solvingOptions.algorithm == "ASTAR" && (
        <>
          <b>Algo Options:</b>
          <div>
            <input
              name="greedy"
              type="checkbox"
              checked={solvingOptions.greedy}
              onChange={(e) =>
                updateSolvingOptions((prev) => {
                  return {
                    ...prev,
                    greedy: e.target.checked,
                  };
                })
              }
            />
            <label htmlFor="greedy">Greedy</label>
          </div>
          <div>
            <input
              name="uniform"
              type="checkbox"
              checked={solvingOptions.uniform}
              onChange={(e) =>
                updateSolvingOptions((prev) => {
                  if (solvingOptions.size == 3)
                    return {
                      ...prev,
                      uniform: e.target.checked,
                    };
                  alert(
                    "Sorry, you can't use UNIFORM search with puzzle's size bigger than 3, it will take forever to solve."
                  );
                  return prev;
                })
              }
            />
            <label htmlFor="uniform">Uniform</label>
          </div>
        </>
      )}

      <div>
        <b>Queue Type:</b>
        <select
          name="qtype"
          id="qtype"
          defaultValue={solvingOptions.queueType}
          onChange={(e) =>
            updateSolvingOptions((prev) => ({
              ...prev,
              queueType: e.target.value,
            }))
          }
        >
          <option value="priorityQ">Priority Queue</option>
          <option value="heapQ">heap Queue</option>
        </select>
      </div>
    </>
  );
}

function Heuristics({ solvingOptions, updateSolvingOptions, addOrRemove }) {
  return (
    <div>
      <b>Heuristics:</b>
      {[
        "manhattan",
        "linearConflicts",
        "gaschnig",
        "hamming",
        "euclidean",
        "diagonal",
      ].map((h, i) => (
        <div key={h + "-key"}>
          <input
            type="checkbox"
            name={`heuristic-${h}`}
            value={h}
            defaultChecked={solvingOptions.heuristics.includes(h)}
            onChange={(e) =>
              updateSolvingOptions((prev) => ({
                ...prev,
                heuristics: addOrRemove(prev.heuristics, e.target.value),
              }))
            }
          />
          <label htmlFor={`heuristic-${h}`}>{h}</label>
        </div>
      ))}
    </div>
  );
}
