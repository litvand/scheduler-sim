var GUI = {};

(function(){

var gui; // File scope

var procColors = [ // Kelly's 22 colors of maximum constrast, except for white and black.
    '#FFB300', // Vivid Yellow
    '#803E75', // Strong Purple
    '#FF6800', // Vivid Orange
    '#A6BDD7', // Very Light Blue
    '#C10020', // Vivid Red
    '#CEA262', // Grayish Yellow
    '#817066', // Medium Gray

    // The following will not be good for people with defective color vision.
    '#007D34', // Vivid Green
    '#F6768E', // Strong Purplish Pink
    '#00538A', // Strong Blue
    '#FF7A5C', // Strong Yellowish Pink
    '#53377A', // Strong Violet
    '#FF8E00', // Vivid Orange Yellow
    '#B32851', // Strong Purplish Red
    '#F4C800', // Vivid Greenish Yellow
    '#7F180D', // Strong Reddish Brown
    '#93AA00', // Vivid Yellowish Green
    '#593315', // Deep Yellowish Brown
    '#F13A13', // Vivid Reddish Orange
    '#232C16'  // Dark Olive Green
];
var black = '#000000', white = '#FFFFFF';

function getMethod() {
    return document.getElementById('method').value.trim();
}

function getCtx() {
    var canvas = document.getElementById('myCanvas');
    return canvas.getContext('2d');
}

function drawText(text, x, y, fontSize) {
    if (isUndefOrNull(fontSize)) fontSize = 16;

    var ctx = getCtx();
    ctx.font = fontSize.toString() + 'px Arial';
    ctx.fillStyle = black;
    ctx.fillText(text, x, y);
}

function drawBlocks(blocks) {
    var debug = false;
    if (debug) alert(strFromBlocks(blocks));
    
    var ctx = getCtx();
    var width = ctx.canvas.clientWidth, height = ctx.canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath(); // Otherwise empty rectangles aren't cleared.

    assert(blocks[0].start == 0);
    var lastBlock = getLastElem(blocks);
    var totalTime = lastBlock.start + lastBlock.len;
    var xOffset = 10;
    var scale = Math.min(50, (width - xOffset) / totalTime);

    var y0 = 10, blockHeight = 50;
    var xStart = 0, totalWidth = 0;
    
    for (var i = 0; i < blocks.length; ++i) {
        var b = blocks[i];
        
        var color;
        if (isUndefOrNull(b.pid)) {
            color = black;
        } else if (b.pid == sleepPid) {
            color = white;
        } else {
            assertNonNegInt(b.pid);
            color = procColors[b.pid % procColors.length];
        }
        ctx.fillStyle = color;

        var x0 = xOffset + b.start * scale, blockWidth = b.len * scale;
        ctx.fillRect(x0, y0, blockWidth, blockHeight);
        
        if (!isUndefOrNull(b.pid) && b.pid != sleepPid) {
            var pidWidth = b.pid < 10 ? 10 : 25; // Two digits are wider than one.
            var x = x0 + 0.5 * blockWidth - 0.5 * pidWidth;
            var y = y0 + 0.5 * blockHeight;
            drawText((b.pid + 1).toString(), x, y);
        }
        drawText(b.start.toString(), x0 - 4, y0 + blockHeight + 15, 14);

        if (i == 0) xStart = x0;
        totalWidth += blockWidth;
    }

    ctx.fillStyle = black;
    ctx.rect(xOffset, y0, width - 11, blockHeight);
    ctx.stroke();
}

function drawMsg(msg) {
    getCtx().clearRect(0, 105, 500, 100);
    drawText(msg, 410, 100);
}

function drawError(msg) { drawMsg(isUndefOrNull(msg) ? 'Error' : 'Error: ' + msg); }
function drawSuccess() { drawMsg('Success'); }

function drawGUI() {
    var blocks = Sim[gui.method](gui.procs);
    var waitTime = getAvgWaitTime(blocks, gui.procs);
    drawBlocks(blocks);
    drawText('Average wait time: ' + waitTime.toString(), 10, 100);
    //drawSuccess();
}

GUI.init = function() {
    gui = {method: getMethod()};
    GUI.updateProcs();
}

GUI.updateMethod = function() {
    var method = getMethod();
    if (method && Sim[method]) {
        gui.method = method;
        drawGUI(); // TODO: Don't draw "Success" if processes are wrong.
    } else {
        drawError('Unknown method');
    }
}

GUI.updateProcs = function() {
    var procs = getProcs();
    if (procs) {
        gui.procs = procs;
        drawGUI();
    } else {
        drawError('Invalid processes');
    }
}

GUI.setExample = function(i) {
    var button = document.getElementById('example' + i)
    var example = button.firstChild.nodeValue; // Displayed button text
    document.getElementById('procs').value = example;
    GUI.updateProcs();
}

})()