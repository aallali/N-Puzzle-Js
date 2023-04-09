/* eslint-disable eqeqeq */
export function SinglePuzzle({ puzzle, complete, onMovePiece }) {
  return (
    <div
      style={{
        display: "inline-block",
        backgroundColor: "#616161",
        // border: `5px solid ${complete ? "black" : "gray"}`,
        borderRadius: 5,
        padding: 5,
        margin: 7,
      }}
    >
      {puzzle.map((row, i) => (
        <div
          key={i}
          style={{
            display: "flex",
          }}
        >
          {row.map((col, j) => {
            const color =
              col === 0 || col == "0" ? "transparent" : "rgb(211 211 211)";
            return (
              <div
                key={`${i}-${j}`}
                onClick={() => (complete ? null : onMovePiece(i, j))}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 59,
                  height: 59,
                  margin: 2,
                  backgroundColor: color,
                  borderRadius: 5,
                  cursor: complete ? "not-allowed" : "pointer",
                  userSelect: "none",
                }}
              >
                <span
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "bolder",
                    // color: "white",
                  }}
                >
                  {col !== 0 && col !== "0" && col}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default SinglePuzzle;
