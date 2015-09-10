var daggy = require('daggy'),
    
    Sequence = daggy.require('x');

Sequence.of = function(x) {
    return Sequence([x]);
};

Sequence.empty = function() {
    return Sequence([]);
};

// Export
if(typeof module != 'undefined')
    module.exports = Sequence;
