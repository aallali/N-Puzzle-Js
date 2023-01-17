/**
 * prototyping the queue system to manage a list of nodes where 
 * every new element is put in correct position to make 
 * an ASC list by score value
 */
export default class PriorityQueue {
    constructor() {
        this.items = [];
    }
    /**
     * 
     * @param {Node} elem
     * @explanation : take a puzzle element of type Node 
     * then put it in the position in the list by its score
     */
    enqueue(elem) {
        let contain = false;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].score > elem.score) {
                this.items.splice(i, 0, elem);
                contain = true;
                break;
            }
        }
        if (!contain) {
            this.items.push(elem);
        }
    }
    /**
     * 
     * @returns return first element and pop it from the list
     */
    dequeue() {
        return this.isEmpty() ? undefined : this.items.shift();
    }

    /**
     * 
     * @returns check if the items list is empty
     */
    isEmpty() {
        return this.items.length === 0;
    }
} 
