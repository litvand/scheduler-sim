function Stack() {
    this.elems = [];
}

Stack.prototype.len = function() {
    return this.elems.length;
};

Stack.prototype.start = function() {
    return this.elems[0];
};

Stack.prototype.add = function(elem) {
    this.elems.push(elem);
};

Stack.prototype.addStart = function(elem) {
    addElem(this.elems, 0, elem);
};

Stack.prototype.pop = function() {
    return this.elems.pop();
};