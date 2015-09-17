var Seq = require('./../seq');

function unsafeIndex(x, n) {
    return x.x[n];
}

function head(x) {
    return unsafeIndex(x, 0);
}

function tail(x) {
    return Seq(x.x.slice(1, x.x.length));
}

function last(x) {
    return unsafeIndex(x, x.x.length - 1);
}

function init(x) {
    return Seq(x.x.slice(0, x.x.length - 1));
}

// Export
if(typeof module != 'undefined')
    module.exports = {
        unsafeIndex: unsafeIndex,
        head: head,
        tail: tail,
        last: last,
        init: init
    };