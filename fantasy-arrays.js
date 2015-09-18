var List       = require('./src/list'),
    NonEmpty   = require('./src/nonempty'),
    Seq        = require('./src/seq'),
    unsafeList = require('./src/unsafe/list'),
    unsafeSeq  = require('./src/unsafe/seq'),
    zipperSeq  = require('./src/zippers/seq');

if (typeof module != 'undefined')
    module.exports = {
        List    : List,
        NonEmpty: NonEmpty,
        Seq     : Seq,
        unsafe  : {
            list: unsafeList,
            seq : unsafeSeq
        },
        zippers : {
            Seq : zipperSeq
        }
    };