function isNaN(x) { return x != x; }

function isUndef(x) { return typeof(x) == 'undefined'; }

function isUndefOrNull(x) { return isUndef(x) || x == null; }