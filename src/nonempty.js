var daggy = require('daggy'),
    Sequence = require('./sequence'),

    NonEmpty = daggy.tagged('a', 'as');

NonEmpty.of = function(x) {
    return NonEmpty(x, Sequence.empty());
};

NonEmpty.singleton = function(x) {
    return NonEmpty.of(x);
};

NonEmpty.prototype.map = function(f) {
    return NonEmpty(f(this.a), this.as.map(f));
};

// Export
if(typeof module != 'undefined')
    module.exports = NonEmpty;
