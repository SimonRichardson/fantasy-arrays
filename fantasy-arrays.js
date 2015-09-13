var List     = require('./src/list'),
    NonEmpty = require('./src/nonempty'),
    Sequence = require('./src/sequence'),
    unsafe   = require('./src/unsafe');

if (typeof module != 'undefined')
    module.exports = {
        List    : List,
        NonEmpty: NonEmpty,
        Sequence: Sequence,
        unsafe  : unsafe
    };