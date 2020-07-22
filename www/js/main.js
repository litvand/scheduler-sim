function test() {
    GUI.init();
    
    var procs = [
        {start: 1, len: 2}, 
        {start: 4, len: 2},
        {start: 5, len: 3}
    ];
    for (var i = 0; i < procs.length; ++i) procs[i].pid = i;
    assertProcs(procs);
    
    var blocks = Sim.fcfs(procs);
    drawBlocks(blocks);
}

function run() { GUI.init(); }