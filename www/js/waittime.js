function getPidFirstIndex(blocks, pid) { // REM?
    for (var i = 0; i < blocks.length; ++i) {
        if (blocks[i].pid == pid) return i;
    }
    return null;
}

function getPidLastIndex(blocks, pid) {
    for (var i = blocks.length - 1; i >= 0; --i) {
        if (blocks[i].pid == pid) return i;
    }
    return null;
}

function getWaitTime(blocks, proc) {
    var last = getPidLastIndex(blocks, proc.pid);
    if (isUndefOrNull(last)) return null;

    var waitTime = 0;
    for (var i = 0; i < last; ++i) {
        if (blocks[i].pid != proc.pid) {
            var blockEnd = blocks[i].start + blocks[i].len;
            waitTime += Math.min(blocks[i].len, Math.max(0, blockEnd - proc.start));
        }
    }
    return waitTime;
}

function getAvgWaitTime(blocks, procs) {
    var totalWaitTime = 0;
    for (var i = 0; i < procs.length; ++i) {
        var waitTime = getWaitTime(blocks, procs[i]);
        assert(!isUndefOrNull(waitTime));
        totalWaitTime += waitTime;
    }
    return totalWaitTime / procs.length;
}
