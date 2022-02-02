class Queue {
    /**
     * Creates new array to store elements in the queue
     */
    constructor() {
        this.elements = [];
        this.queuing = false;
    }

    /**
     * Adds an element to the queue
     * @param {any} element The data to queue
     * @returns {void}
     */
    enqueue(element) {
        this.elements.push(element);
    }

    /**
     * Removes the first element from the queue
     * @returns {any} The first element in the queue
     */
    dequeue() {
        return this.elements.shift();
    }

    /**
     * Checks if the queue is empty
     * @returns {boolean} Is the queue empty
     */
    isEmpty() {
        return this.elements.length == 0;
    }

    /**
     * Returns the first element in the queue without dequeuing it
     * @returns {any} The first element in the queue
     */
    peek() {
        return !this.isEmpty() ? this.elements[0] : undefined;
    }

    /**
     * Shows the current length of the queue
     * @returns {number} The length of the queue
     */
    length() {
        return this.elements.length;
    }
}

module.exports = Queue;