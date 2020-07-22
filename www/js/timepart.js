function assertTimeParts(parts) {
// Parts are e.g. processes or scheduled blocks.

    for (var i = 0; i < parts.length; ++i) {
        assertNonNegInt(parts[i].start);
        assertPosInt(parts[i].len);
    }
    for (var i = 1; i < parts.length; ++i) {
        var curStart = parts[i].start, prevStart = parts[i - 1].start;
        assert(curStart >= prevStart);
    }
}

function strFromTimeParts(parts) {
    var s = '';
    for (var i = 0; i < parts.length; ++i) {
        var b = parts[i];
        s += b.start + ' ' + b.len + ' ';
        s += (typeof b.pid == 'undefined' ? '?' : b.pid) + '\n';
    }
    return s;
}