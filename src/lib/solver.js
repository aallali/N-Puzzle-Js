import PQueue from "./priorityQueue"
import { BloomFilter } from "bloomfilter";

export default class Solver {
    constructor(firstElement) {
        this.visited = new BloomFilter(32 * 1024 * 40000, 32);
        this.queue = new PQueue()
        this.queue.enqueue(firstElement)
        this.solution

    }
    async buildScenario() {
        let steps = []

        while (this.solution) {
            steps.push([this.solution.puzzle, this.solution.score])
            this.solution = this.solution.parent
        }
        steps = steps.reverse()
        return steps
    }

    async start() {
        let count = 0

        const start = process.hrtime();
        while (!this.solution && !this.queue.isEmpty()) {
            const currentPuzzle = this.queue.dequeue();
            currentPuzzle.wakeUpChilds()
            this.visited.add(currentPuzzle.hash)
            count++

            if (currentPuzzle.isFinal) {
                this.solution = currentPuzzle
                break
            }

            for (let i = 0; i < currentPuzzle.childs.length; i++) {
                const child = currentPuzzle.childs[i];
                if (!this.visited.test(child.hash))
                    this.queue.enqueue(child)
            }
        }
        const time = process.hrtime(start)
        const steps = await this.buildScenario()

        return {
            steps,
            cTime : parseInt(this.visited.size()),
            cSize : this.queue.maxOpen,
            tONode: count,
            time
          
        }
    }
}
