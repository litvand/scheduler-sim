function assert(cond, msg) {
    if (!cond) throw msg || "assert";
}