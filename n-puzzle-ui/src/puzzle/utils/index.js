
export const addOrRemove = (arr, item) => arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
export { default as PuzzleGenerator } from "./puzzleGenerator"
export { default as generateGoal } from "./goalGenerator"