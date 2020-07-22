var Sim = {};

(function(){
Sim.fcfs = function(procs) {
    var builder = getBlockBuilder();
    for (var i = 0; i < procs.length; ++i) builder.addProc(procs[i]);
    assertBlocks(builder.blocks, procs.length);
    return builder.blocks;
};

function enqueueArrived(procs, arrivedNum, waiting, curTime) {
    if (procs.length == arrivedNum) return arrivedNum; // No processes to enqueue

    function enqueueUntil(maxTime) {
        while (arrivedNum < procs.length && procs[arrivedNum].start <= maxTime) {
            waiting.add(procs[arrivedNum++]); // arrivedNum == firstUnarrivedIndex
        }
    }

    enqueueUntil(curTime);
    if (waiting.len() == 0) { // There are no processes to execute at the current time.
        var proc = procs[arrivedNum]; // `proc` is the process that will arrive next.
                                      // If there are no other processes arriving at
                                      // the same time as `proc`, then `proc` is also
                                      // the process that will be executed next.
        assert(proc.start > curTime); // There was nothing to do, so `proc` must not have
                                      // arrived yet at `curTime`.
        enqueueUntil(proc.start); // Look ahead for more processes.
    }

    assert(waiting.len() > 0);
    return arrivedNum;
}

function getProcPriority(proc) { return -proc.len; } // Lower len ---> higher priority

Sim.sjf = function(procs) {
    var builder = getBlockBuilder();

    // `waiting` contains arrived processes that haven't been executed yet.
    var waiting = new PriorityQueue(getProcPriority);
    var arrivedNum = 0; // This includes processes that have already been executed.

    while (true) {
        var allArrived = (arrivedNum == procs.length);
        var allExecuted = (waiting.len() == 0);
        if (allArrived && allExecuted) break;

        arrivedNum = enqueueArrived(procs, arrivedNum, waiting, builder.curTime);
        builder.addProc(waiting.pop());
    }

    var nonSleepNum = 0;
    for (var i in builder.blocks) {
        var isSleepBlock = (builder.blocks[i].pid === sleepPid);
        nonSleepNum += !isSleepBlock;
    }
    assert(nonSleepNum == procs.length); // Each process is executed all at once.
    assertBlocks(builder.blocks, procs.length);
    return builder.blocks;
};

Sim.srtf = function(procs) {
    procs = copyProcs(procs);
    var builder = getBlockBuilder();
    var waiting = new PriorityQueue(getProcPriority); // See `simSJF` for comments.
    var arrivedNum = 0;
    var prevProc;
    while (arrivedNum < procs.length || waiting.len() != 0) {
        arrivedNum = enqueueArrived(procs, arrivedNum, waiting, builder.curTime);
        
        // If there are multiple processes waiting which have the same
        // remaining length and one of them was executed in the previous
        // iteration of the `while` loop, then always keep executing the
        // previously executing process, even though several other
        // processes also have the same remaining execution time.
        var proc = waiting.pop();
        if (prevProc && proc.len == prevProc.len) assert(proc.pid == prevProc.pid);

        assertPosInt(proc.len);
        var remainingLen = proc.len - 1;

        proc.len = 1; // Execute process for unit timestep.
        builder.addProc(proc);

        proc.len = remainingLen;
        if (proc.len > 0) {
            // Put process back in queue with shorter remaining execution time.
            var popSoon = true; // Pop before other processes with equal priority.
            waiting.add(proc, null, popSoon);
        }
        prevProc = proc;
    }
    assertBlocks(builder.blocks, procs.length);
    return builder.blocks;
};

Sim.rr = function(procs) {
    procs = copyProcs(procs);

    var quantam = 3;
    assertPosInt(quantam);
    
    var builder = getBlockBuilder();
    var waiting = new Stack();
    var arrivedNum = 0;

    while (arrivedNum < procs.length || waiting.len() > 0) {
        var newProcs = new Stack();
        var newArrivedNum = enqueueArrived(procs, arrivedNum, newProcs, builder.curTime);
        if (newProcs.len() > 0 && (waiting.len() == 0 || newProcs.start().start <= builder.curTime)) {
            arrivedNum = newArrivedNum;
            while (newProcs.len() > 0) waiting.add(newProcs.pop());
        }

        var remainingTime = quantam;
        while (remainingTime > 0 && waiting.len() > 0) {
            var proc = waiting.pop();
            var execLen = Math.min(proc.len, quantam);
            var remainingLen = proc.len - execLen;

            proc.len = execLen;
            builder.addProc(proc);

            proc.len = remainingLen;
            if (proc.len > 0) waiting.addStart(proc);
            remainingTime -= execLen;
        }
    }

    assertBlocks(builder.blocks, procs.length);
    return builder.blocks;
};

})() // Immediately invoked function expression for file scope