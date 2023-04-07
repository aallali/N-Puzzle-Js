export default function SolvingOptions({
  expanded,
  solvingOptions,
  updateSolvingOptions,
  addOrRemove,
  setQType,
  runSolver,
}) {
  return (
    <>
      {expanded ? (
        <div className="expanded">
          {!solvingOptions.uniform ? (
            <Heuristics
              solvingOptions={solvingOptions}
              updateSolvingOptions={updateSolvingOptions}
              addOrRemove={addOrRemove}
            />
          ) : null}
          <AlgoOptions
            solvingOptions={solvingOptions}
            updateSolvingOptions={updateSolvingOptions}
            setQType={setQType}
          />
          <button className="confButton" onClick={runSolver}>
            Solve
          </button>
        </div>
      ) : null}
    </>
  );
}

function AlgoOptions({ solvingOptions, updateSolvingOptions, setQType }) {
  return (
    <>
      <b>Algo Options:</b>
      <div>
        <input
          name="greedy"
          type="checkbox"
          defaultChecked={solvingOptions.greedy}
          onChange={(e) =>
            updateSolvingOptions((prev) => ({
              ...prev,
              greedy: e.target.checked,
            }))
          }
        />
        <label htmlFor="greedy">Greedy</label>
      </div>
      <div>
        <input
          name="uniform"
          type="checkbox"
          defaultChecked={solvingOptions.uniform}
          onChange={(e) =>
            updateSolvingOptions((prev) => ({
              ...prev,
              uniform: e.target.checked,
            }))
          }
        />
        <label htmlFor="uniform">Uniform</label>
      </div>
      <div>
        <b>Queue Type:</b>
        <select
          name="qtype"
          id="qtype"
          onChange={(e) => setQType(e.target.value)}
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
