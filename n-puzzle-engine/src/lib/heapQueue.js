
import heapq from "heapq";

/**
 * prototyping the queue system to manage a list of nodes where 
 * every new element is put in correct position to make 
 * an ASC list by score value
 */
export default class HeapQueue {
    constructor() {
        this.items = [];
        this.maxOpen = 0;
        this.cmp = function(x, y) { return x.score < y.score }
    }
    /**
     * 
     * @param {Node} elem
     * @explanation : take a puzzle element of type Node 
     * then put it in the position in the list by its score
     */
    enqueue(elem) {
        heapq.push(this.items, elem, this.cmp);
        
        // get complexity in size
        if (this.items.length > this.maxOpen)
            this.maxOpen = this.items.length
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
        return !this.items.length;
    }
} 
