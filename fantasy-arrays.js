var NonEmpty = require('./src/nonempty'),
    Sequence = require('./src/sequence'),
    Unsafe   = require('./src/unsafe');

if (typeof module != 'undefined')
    module.exports = {
        NonEmpty: NonEmpty,
        Sequence: Sequence,
        Unsafe  : Unsafe
    };