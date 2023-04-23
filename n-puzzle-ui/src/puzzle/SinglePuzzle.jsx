/* eslint-disable eqeqeq */

// animation
// transition: 0.5s;
// transform: translate(0px, 65px); bottom
// transform: translate(0px, -65px); top
// transform: translate(65px, 0px); right
// transform: translate(-65px, 0px); left

// TODO : add animation on move
// eslint-disable-next-line no-unused-vars
function getSlideAnimationDirection(dir) {
  switch (dir) {
    case "U":
      return "translate(0px, -65px)";
    case "D":
      return "translate(0px, 65px)";
    case "R":
      return "translate(65px, 0px)";
    case "L":
      return "translate(-65px, 0px)";
    default:
      return;
  }
}
export function SinglePuzzle({ puzzle, complete, onMovePiece }) {
  let tileSize = 65;
  if (puzzle.length == 4) tileSize = 47.75;
  else if (puzzle.length == 5) tileSize = 47;

 
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
                key={`tile-${i}-${j}`}
                onClick={(e) => {
                  return complete ? null : onMovePiece(e, i, j);
                }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: tileSize,
                  height: tileSize,
                  margin: 2,
                  backgroundColor: color,
                  borderRadius: 5,
                  cursor: complete ? "not-allowed" : "pointer",
                  userSelect: "none",
                  // transition: "0.2s",
                  // transform: getSlideAnimationDirection("L"),
                }}
              >
                <span
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "bolder",
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
