var daggy  = require('daggy'),
    Seq    = require('./seq'),
    unsafe = require('./unsafe/seq'),
    Option = require('fantasy-options'),

    NonEmpty = daggy.tagged('a', 'as');

NonEmpty.of = function(x) {
    return NonEmpty(x, Seq.empty());
};

NonEmpty.singleton = NonEmpty.of;

NonEmpty.prototype.length = function() {
    return this.as.length + 1;
};

NonEmpty.prototype.cons = function(a) {
    return NonEmpty(a, Seq.of(this.a).concat(this.as));
};

NonEmpty.prototype.head = function() {
    return Option.Some(this.a);
};

NonEmpty.prototype.last = function() {
    return Option.Some(unsafe.last(this.as));
};

NonEmpty.prototype.tail = function() {
    var a  = unsafe.head(this.as),
        as = unsafe.tail(this.as);
    return Option.Some(NonEmpty(a, as));
};

NonEmpty.prototype.init = function() {
    return Option.Some(NonEmpty(a, unsafe.init(this.as)));
};

NonEmpty.prototype.index = function(x) {
    return x === 0 ? Option.Some(this.a) : 
        x + 1 < this.as.length ? Option.Some(this.as[x + 1]) :
        Option.None;
};

NonEmpty.prototype.reverse = function() {
    var x = Seq.of(this.a).concat(this.as).reverse();
    return NonEmpty(unsafe.head(x), unsafe.tail(x));
};

NonEmpty.prototype.concat = function(a) {
    return NonEmpty(a.a, a.as.concat(Seq.of(this.a).concat(this.as)));
};

NonEmpty.prototype.ap = function(x) {
    return this.chain(function(f) {
        return x.map(f);
    });
};

NonEmpty.prototype.map = function(f) {
    return NonEmpty(f(this.a), this.as.map(f));
};

NonEmpty.prototype.chain = function(f) {
    var x = this.toSeq().chain(function(a) {
        return f(a).toSeq();
    });
    return NonEmpty(unsafe.head(x), unsafe.tail(x));
};

NonEmpty.prototype.concatMap = function(f) {
    return this.chain(f);
};

NonEmpty.prototype.toSeq = function() {
    return this.as.cons(this.a);
};

NonEmpty.prototype.toArray = function() {
    return this.toSeq().toArray();
};

// Export
if(typeof module != 'undefined')
    module.exports = NonEmpty;
