var daggy = require('daggy'),
    Seq   = require('./seq'),

    NonEmpty = daggy.tagged('a', 'as');

NonEmpty.of = function(x) {
    return NonEmpty(x, Seq.empty());
};

NonEmpty.singleton = NonEmpty.of;

NonEmpty.prototype.map = function(f) {
    return NonEmpty(f(this.a), this.as.map(f));
};

NonEmpty.prototype.chain = function(f) {
    return {};
};

NonEmpty.prototype.concatMap = function(f) {
    return this.chain(f);
};

NonEmpty.prototype.toSeq = function() {
    return this.as.cons(this.a);
};

NonEmpty.prototype.toArray = function() {
    return this.as.cons(this.a).toArray();
};

// Export
if(typeof module != 'undefined')
    module.exports = NonEmpty;
