function isInt(x) { return Math.floor(x) === x; }

function isNonNegInt(x) { return isInt(x) && x >= 0; }

function isPosInt(x) { return isInt(x) && x > 0; }

function assertInt(x) { assert(isInt(x), x.toString()); }

function assertPosInt(x) { assert(isPosInt(x), x.toString()); }

function assertNonNegInt(x) { assert(isNonNegInt(x), x.toString()); }