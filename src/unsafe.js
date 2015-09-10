function unsafeIndex(x, n) {
    return x[n];
}

function head(x) {
    return unsafeIndex(x, 0);
}

function tail(x) {
    return x.slice(1, x.length);
}

function last(x) {
    return unsafeIndex(x, x.length - 1);
}

function init(x) {
    return x.slice(0, x.length - 1);
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