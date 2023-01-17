import PQueue from "./priorityQueue"
import { printPuzzle } from "../utils"

const { log } = console;
 
function blok(s) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, s * 1000)
    })
}

export default class Solver {
    constructor(firstElement) {
        this.visited = new Set()
        this.queue = new PQueue()
        this.queue.enqueue(firstElement)

    }
    async buildScenario(solution) {
        let steps = []

        while (solution) {
            steps.push([solution.puzzle, solution.score])
            solution = solution.parent
        }
        steps = steps.reverse()
        for (let i = 0; i < steps.length; i++) {
            console.clear()
            printPuzzle(steps[i][0], steps[i][1])
            log(`Step n: ${i+1}/${steps.length}`)
            await blok(0.2)
        }
       
    }

    async start() {
        let count = 0
        let solutionFound = false
        while (!solutionFound && !this.queue.isEmpty()) {
            const currentPuzzle = this.queue.dequeue();
            currentPuzzle.wakeUpChilds()
            this.visited.add(currentPuzzle.hash)

            for (let i = 0; i < currentPuzzle.childs.length; i++) {
                const child = currentPuzzle.childs[i];
                if (child.isFinal) {
                    solutionFound = true
                    this.buildScenario(child)
                    break
                }

                if (!this.visited.has(child.hash)) {
                    this.queue.enqueue(child)
                    this.visited.add(child.hash)
                }
            }
            count++
        }
    }
}