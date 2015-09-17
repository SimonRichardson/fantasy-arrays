function head(x) {
    return x.x;
}

function tail(x) {
    return x.xs;
}

function last(x) {
    return x.reverse().x;
}

function init(x) {
    return x.reverse().xs.reverse();
}

// Export
if(typeof module != 'undefined')
    module.exports = {
        head: head,
        tail: tail,
        last: last,
        init: init
    };