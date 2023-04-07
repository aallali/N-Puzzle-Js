/* eslint-disable no-empty-pattern */

export default function SolutionTable({
  solution,
  solvingOptions,
}) {
  return (
    <div>
      <fieldset>
        <legend>Solution</legend>
        <table>
          <tbody>
            <tr>
              <td>N Steps to solution</td>
              <td> {solution.steps.length - 1}</td>
            </tr>
            <tr>
              <td>complexity in time</td>
              <td> {solution.cTime}</td>
            </tr>
            <tr>
              <td>complexity in size</td>
              <td> {solution.cSize}</td>
            </tr>
            <tr>
              <td>Time spent</td>
              <td>
                {parseInt(solution.time / 1000) +
                  "s " +
                  (solution.time % 1000) +
                  "ms"}
              </td>
            </tr>
            <tr>
              <td>Steps</td>
              <td></td>
            </tr>
            <tr>
              <td>Algorithm</td>
              <td> A* (a star)</td>
            </tr>
            <tr>
              <td>heuristics</td>
              <td>
                {" "}
                {(
                  (!solvingOptions.uniform && solvingOptions.heuristics) ||
                  []
                ).map((h) => (
                  <div key={h}>
                    {h}
                    <br />
                  </div>
                ))}
              </td>
            </tr>
            <tr>
              <td>Tree level ignored</td>
              <td> {(solvingOptions.greedy && "Yes") || "No"}</td>
            </tr>
            <tr>
              <td>Score ignored</td>
              <td> {(solvingOptions.uniform && "Yes") || "No"}</td>
            </tr>
          </tbody>
        </table>
      </fieldset>
    </div>
  );
}
