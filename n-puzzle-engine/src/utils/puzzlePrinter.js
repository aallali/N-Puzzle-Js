
/**
 * 
 * @param {[][]} map 
 * @param {number|undefined} score
 * @output print formatted puzzle to console 
 */
export default function printPuzzle(puzzleMap, score) {
    const map = JSON.parse(JSON.stringify(puzzleMap))
    const { log } = console;
    let line = ""
    log("================")
    let size = map.length
  
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map.length; j++) {
        if (map[i][j] == '0')
            map[i][j] = '█'
        line += " " + map[i][j] + " ".repeat(((size * size).toString().length - map[i][j].length)) + ' '
        if (score != undefined && i == map.length - 1 && j == map.length - 1)
          line += "\x1b[33m  score: " + score + "\x1b[0m"
      }
      
      log(line)
      line = ''
    }
    log("================")
}