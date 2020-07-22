function PriorityQueue(getElemPriority) {
    this.elems = [];
    this.priorities = [];
    this.getElemPriority = getElemPriority; // Optional if priority is always passed to `add`.
}

PriorityQueue.prototype.add = function(elem, priority, popSoon) { // Linear time complexity
// If `popSoon` is true and several elements have equal priorities, the one that
// was added *last* will be returned first.

    if (isUndefOrNull(priority)) priority = this.getElemPriority(elem);

    for (var i = 0; i < this.elems.length; ++i) {
        var cmp = popSoon ? priority < this.priorities[i] : priority <= this.priorities[i];
        if (cmp) {
            addElem(this.elems, i, elem);
            addElem(this.priorities, i, priority);
            return;
        }
    }
    this.elems.push(elem);
    this.priorities.push(priority);
};

PriorityQueue.prototype.pop = function() { // Constant time complexity
    this.priorities.pop();
    return this.elems.pop();
};

PriorityQueue.prototype.peek = function() {
    return getLastElem(this.elems);
};

PriorityQueue.prototype.len = function() {
    return this.elems.length;
};