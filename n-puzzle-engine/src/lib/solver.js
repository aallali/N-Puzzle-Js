import PQueue from "./priorityQueue";
import HQueue from "./heapQueue";
import { BloomFilter } from "bloomfilter";
import { is_solvable, findIndexOf } from "../utils";

// const { log } = console;

export default class Solver {
    constructor(queueType) {

        // the list of visited nodes so we dont open same node twice
        this.visited = [] // closed Set
        this.queue = [] // open Set
        this.queueType = queueType
        this.solution = null
        this.isSolvable = false
        this.stats = { count: 0, time: 0 }
    }
    /**
     * reset the class props
     * @param {Node} firstElement first puzzle state
     */
    resetProps(firstElement) {
        this.visited = new BloomFilter(32 * 1024 * 40000, 32);
        // queue of pending nodes to open
        if (this.queueType == "heapQ") this.queue = new HQueue();
        else if (this.queueType == "priorityQ") this.queue = new PQueue();
        else throw Error(`Please enter correct queue Type ["heapQ", "priorityQ"]`);
        // the class property that will store the solution
        this.solution = null;

        this.stats = {
            count: 0,
            // store the current timestamp in start variable to be used later for execution time calculation
            time: new Date()
        }
        if (firstElement) {
            this.queue.enqueue(firstElement)
        }
    }
    /**
     * check if currentState can be solved to targetState
     * @param {string[][]} currentState 
     * @param {string[][]} targetState 
     * @returns 
     */
    checkSolvability(currentState, targetState) {
        return is_solvable(
            currentState,
            targetState,
            currentState.length
        );
    }
    /**
     * generate all steps from first state to final state and reduce them into one array
     * @returns [[state, g(), h(), move]]
     */
    buildScenario() {
        let steps = [];

        while (this.solution) {
            steps.push([this.solution.puzzle, this.solution.h, this.solution.g || this.solution.treeLevel]);
            this.solution = this.solution.parent;
        }
        steps = steps.reverse();
        this.getTheSteps(steps)
        return steps;
    }
    getTheSteps(steps) {
        const moves = {
            "01": "R",
            "-10": "U",
            "0-1": "L",
            "10": "D",
        };

        for (let i = 1; i < steps.length; i++) {
            const [s1, s2] = [steps[i][0], steps[i - 1][0]]
            const [e1, e2] = [findIndexOf(s1, "0"), findIndexOf(s2, "0")]
            steps[i][3] = moves[`${e1.x - e2.x}${e1.y - e2.y}`]
        }
    }
    /**
     * A* = A Star algorithm
     * @returns solution || -1
     */
    async start_ASTAR(max_iter = +Infinity, firstNode) {
        this.resetProps(firstNode)
        function _logic() {



            // loop while the queue is not empty and solution is not found yet
            while (!this.solution && !this.queue.isEmpty()) {
                if (this.stats.count > max_iter) {
                    return -1
                }
                // extract the first node in queue and pop it from the queue list
                const currentPuzzle = this.queue.dequeue();
                // add first puzzle to visited set
                this.visited.add(currentPuzzle.hash); // CLOSED Set
                // increment count (number of loops/nodes)
                this.stats.count++;

                // check if the current node is the target/goal node
                if (currentPuzzle.isFinal) {
                    // store the current node in the this.solution and break
                    this.solution = currentPuzzle;
                    break;
                }

                // wake up the childs : call a new Node() with the params stored in the childs property
                currentPuzzle.wakeUpChilds();

                // loop through all the childs in the current node (if any)
                // check if the child visited before and pre-append in the queue if not visited
                for (let i = 0; i < currentPuzzle.childs.length; i++) {
                    const child = currentPuzzle.childs[i];
                    if (!this.visited.test(child.hash)) {
                        // add the current child node hash to visited set
                        this.visited.add(child.hash);
                        // add the child node to queue
                        this.queue.enqueue(child);
                    }
                }
            }
            // build a history of steps made from the start puzzle to the goal puzzle with buildScenario() method
            const steps = this.buildScenario();

            // complexity in time : number of nodes opened through the process of solving.
            // complexity in size : the max number of nodes where pending in Queue at the same time.
            // time               : time spent to find the solution
            return {
                steps,
                cTime: this.stats.count,
                cSize: this.queue.maxOpen,
                // calc the diff time between start and now, store the output in time
                time: new Date() - this.stats.time,
            };
        }
        const result = _logic.bind(this)()
        this.resetProps()
        return result

    }
    /**
     * BFS = Breadth First Search algorithm
     * iterate through all element of current level 
     * before jump to next level in tree
     * @returns solution || -1
     */
    async start_BFS(max_iter = +Infinity, firstNode) {
        firstNode.greedy = false
        firstNode.uniform = true
        firstNode.initNode()
        return this.start_ASTAR(max_iter, firstNode)
    }
    /**
     * DFS = Depth First Search algorithm
     * @returns solution || -1
     */
    async start_DFS(max_iter = Infinity, firstNode) {
        // firstNode.greedy = true
        // firstNode.uniform = false
        // firstNode.initNode()
        this.resetProps(firstNode)
        async function _logic(max_iter, firstNode) {
            this.visited.add(firstNode.hash);
            if (this.stats.count > max_iter) {
                return -1
            }
            this.stats.count++
            if (firstNode.isFinal) {

                this.solution = firstNode;
                return {
                    steps: this.buildScenario(),
                    cTime: this.stats.count,
                    cSize: this.queue.maxOpen,
                    // calc the diff time between start and now, store the output in time
                    time: new Date() - this.stats.time,
                };

            }

            // extract the first node in queue and pop it from the queue list
            firstNode.wakeUpChilds()
            firstNode.childs.sort((a, b) => a.score - b.score)
            // firstNode.childs.reverse()
            for (let i = 0; i < firstNode.childs.length; i++) {
                const child = firstNode.childs[i];
                if (!this.visited.test(child.hash)) {

                    const res = await _logic.bind(this)(max_iter, child)
                    if (res != null)
                        return res
                }
            }
            // console.log(this.stats.count, this.queue.maxOpen)
            return null
        }

        const result = await _logic.bind(this)(max_iter, firstNode)
        this.resetProps()

        return result
    }


}
