import PQueue from "./priorityQueue"
import { BloomFilter } from "bloomfilter";

export default class Solver {
    constructor(firstElement) {
        // the list of visited nodes so we dont open same node twice
        this.visited = new BloomFilter(32 * 1024 * 40000, 32);
        // queue of pending nodes to open
        this.queue = new PQueue()
        // pre-append the first element to the queue
        this.queue.enqueue(firstElement)
        // the class property that will store the solution
        this.solution = null

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

        // store the current timestamp in start variable to be used later for execution time calculation
        const start = process.hrtime();

        // loop while the queue is not empty and solution is not found yet
        while (!this.solution && !this.queue.isEmpty()) {

            // extract the first node in queue and pop it from the queue list
            const currentPuzzle = this.queue.dequeue();
            // wake up the childs : call a new Node() with the params stored in the childs property
            currentPuzzle.wakeUpChilds()
            // add the current node hash to visited set
            this.visited.add(currentPuzzle.hash)
            // increment count (number of loops/nodes)
            count++

            // check if the current node is the target/goal node
            if (currentPuzzle.isFinal) {
                // store the current node in the this.solution and break
                this.solution = currentPuzzle
                break
            }

            // loop through all the childs in the current node (if any)
            // check if the child visited before and pre-append in the queue if not visited
            for (let i = 0; i < currentPuzzle.childs.length; i++) {
                const child = currentPuzzle.childs[i];
                if (!this.visited.test(child.hash))
                    this.queue.enqueue(child)
            }
        }
        // calc the diff time between start and now, store the output in time
        const time = process.hrtime(start)
        // build a history of steps made from the start puzzle to the goal puzzle with buildScenario() method
        const steps = await this.buildScenario()

        // complexity in time : number of nodes opened through the process of solving.
        // complexity in size : the max number of nodes where pending in Queue at the same time.
        // time               : time spent to find the solution
        return {
            steps,
            cTime: count,
            cSize: this.queue.maxOpen,
            time
        }
    }
}
