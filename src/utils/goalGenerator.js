function covertTo2dArr(arr, size) {
  let result = [];
  for (let i = 0; i < arr.length; i += size) {
	result.push(arr.slice(i, i + size));
  }
  return result;
}
/**
 * 
 * @param {number} size 
 * @returns final puzzle with 0 in the center
 */
export function generateSnailGoalPuzzle(size) {
  let proto = new Array(size * size).fill(0);
  let row = 0;
  let col = 0;
  let rowInc = -1;
  let colInc = 1;
  let inc = 1;
  while (inc < size * size) {
	rowInc *= -1;
	// log(" col:", col, "colInc:", colInc, "row:", row, "rowInc:", rowInc);
	while (
	  (colInc == 1 && col < size && !proto[row * size + col]) ||
	  (colInc == -1 && col >= 0 && !proto[row * size + col])
	) {
	  proto[row * size + col] = inc;
	  col += colInc;
	  inc++;
	}
	if (colInc == 1) {
	  col -= 1;
	  row++;
	} else {
	  col += 1;
	  row--;
	}
	while (
	  (rowInc == 1 && row < size && !proto[row * size + col]) ||
	  (rowInc == -1 && row >= 0 && !proto[row * size + col])
	) {
	  proto[row * size + col] = inc;
	  row += rowInc;
	  inc++;
	}
	if (colInc == 1) col--;
	else col++;
	if (rowInc == 1) row--;
	else row++;
	colInc *= -1;
  }
  return covertTo2dArr(proto.join().split(","), size);
}

/**
 * 
 * @param {number} size 
 * @returns final puzzle with 0 in the start
 */
export function generateZeroFirstGoal(size) {
  let arr = [];
  let row = [];
  for (let x = 0; x < size; x++) {
	row = [];
	for (let i = 0; i < size; i++) row.push((i + x * size).toString());
	arr.push(row);
  }

  return arr;
}

/**
 * 
 * @param {number} size 
 * @returns final puzzle with 0 in the end
 */
export function generateZeroLastGoal(size) {
  let arr = [];
  let row = [];
  for (let x = 0; x < size; x++) {
	row = [];
	for (let i = 0; i < size; i++) row.push((1 + i + x * size).toString());
	arr.push(row);
  }
  arr[size - 1][size - 1] = "0";
  return arr;
}

 
export default {
	snail: generateSnailGoalPuzzle,
	zFirst: generateZeroFirstGoal,
	zLast: generateZeroLastGoal,
  };