function assertBlocks(blocks, procNum) {
    assert(blocks.length >= procNum);
    assertTimeParts(blocks);
    for (var i in blocks) assertPid(blocks[i].pid, procNum);
}

var strFromBlocks = strFromTimeParts;

function getBlockBuilder() { // TODO: Make this into a constructor?
    
    var blocks = [];
    var builder = {blocks: blocks, curTime: 0};
    
    builder.addBlock = function(len, pid) { // `pid` might be `undefined`.
        var prevBlock = getLastElem(blocks);
        if (prevBlock && typeof(pid) != 'undefined' && prevBlock.pid === pid) {
            // Merge adjacent blocks that have the same process.
            var prevEndTime = prevBlock.start + prevBlock.len;
            assert(prevEndTime == builder.curTime);
            prevBlock.len += len;
        } else {
            var block = {start: builder.curTime, len: len, pid: pid};
            blocks.push(block);
        }
        builder.curTime += len;
    };
    
    builder.maybeSleep = function(nextStart) {
        var sleepTime = nextStart - builder.curTime;
        if (sleepTime > 0) builder.addBlock(sleepTime, sleepPid);
    };

    builder.addProc = function(proc) {
        builder.maybeSleep(proc.start);
        builder.addBlock(proc.len, proc.pid);
    };

    return builder; // lol prototypes are for noobs
}