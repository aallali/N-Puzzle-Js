export default function Generator({
  expanded,
  setSize,
  size,
  solvability,
  setSolvability,
  goal,
  setGoal,
  setPuzzle,
  PuzzleGenerator,
}) {
  return (
    <>
      {" "}
      {expanded ? (
        <div className="expanded">
          <div className="row">
            <p>Size:</p>
          </div>
          <div className="row">
            <select
              name="size"
              id="size"
              onChange={(v) => setSize(parseInt(v.target.value))}
              value={size}
            >
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div className="row">
            <p>Solvability:</p>
            <select
              name="solvability"
              id="solvability"
              onChange={(e) => setSolvability(parseInt(e.target.value) === 1)}
            >
              <option value="1">Solvable</option>
              <option value="0">UnSolvable</option>
            </select>
          </div>
          <div className="row">
            <p>Goal State:</p>
            <select
              name="goal"
              id="goal"
              defaultValue={goal}
              onChange={(v) => setGoal(v.target.value.toString())}
            >
              <option value="zLast">zero last</option>
              <option value="zFirst">zero first</option>
              <option value="snail">snail</option>
            </select>
          </div>
          <button
            className="confButton"
            onClick={() =>
              setPuzzle(
                new PuzzleGenerator(size, goal, solvability, 100).map((l) =>
                  l.map((c) => parseInt(c))
                )
              )
            }
          >
            Generate
          </button>
        </div>
      ) : null}
    </>
  );
}
