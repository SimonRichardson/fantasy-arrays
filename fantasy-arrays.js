var NonEmpty = require('./src/nonempty'),
    Sequence = require('./src/sequence'),
    unsafe   = require('./src/unsafe');

if (typeof module != 'undefined')
    module.exports = {
        NonEmpty: NonEmpty,
        Sequence: Sequence,
        unsafe  : unsafe
    };