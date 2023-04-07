import fs from "fs";
 
/**
 * 
 * @param {string} filePath 
 * @returns content of file in path given as string, if found
 */
function loadInput(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, function (err, data) {
      if (err) {
        console.log(err)
        reject(err);
      } else resolve(data.toString());
    });
  });
}

export default loadInput
 