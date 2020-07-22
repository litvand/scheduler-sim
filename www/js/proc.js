var sleepPid = -1; // const global

function assertPid(pid, procNum) {
    assert(pid == sleepPid || (pid >= 0 && pid < procNum));
}

function assertProcs(procs) {
    assertTimeParts(procs);
    for (var i in procs) {
        assertPid(procs[i].pid, procs.length);
    }
}

var strFromProcs = strFromTimeParts;

function getProcs() { // TODO: Take `gui` parameter?
    var procs = [];
    var input = document.getElementById("procs").value;
    var strs = input.trim().split(';');

    for (var i = 0; i < strs.length; ++i) {
        var fields = strs[i].trim().split(',');
        if (fields.length != 2) return null;

        for (var j in fields) {
            if (fields[j].length == 0 || isNaN(Number(fields[j]))) return null;
        }

        var proc = {};
        proc.start = Number(fields[0]);
        proc.len   = Number(fields[1]);
        proc.pid = i;
        procs.push(proc);
    }

    assertProcs(procs);
    return procs;
}

function copyProc(proc) {
    return {start: proc.start, len: proc.len, pid: proc.pid}; // `pid` is optional.
}

function copyProcs(procs) {
    var copy = [];
    for (var i = 0; i < procs.length; ++i) copy.push(copyProc(procs[i]));
    return copy;
}