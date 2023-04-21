/**
 *
 * @param {[][]}} arr2D
 * @param {string} trgt
 * @returns {x: number, y: number} coordination of the trgt in arr2D if found
 * @returns {undefined} if not found
 */
function findindexOf(arr2D, trgt) {
    const size = arr2D.length;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (arr2D[i][j] == trgt) return { x: i, y: j };
        }
    }
}


export default findindexOf