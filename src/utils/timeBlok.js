
/**
 * 
 * @param {number} s 
 * @output blok the process for 's' seconds by a promise. 
 */
export default function blok(s) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, s * 1000)
    })
}