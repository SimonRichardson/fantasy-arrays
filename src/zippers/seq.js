var daggy  = require('daggy'),
    Seq    = require('./../seq'),
    unsafe = require('./../unsafe/seq'),
    Option = require('fantasy-options'),

    Zipper = daggy.tagged('l', 'c', 'r');

Zipper.of = function(x) {
    return Zipper(Seq.empty(), x, Seq.empty());
};

Zipper.prototype.up = function() {
    var self = this;
    return this.l.tail().chain(function(a) {
        return self.l.head().map(function(b) {
            return Zipper(a, b, self.r.cons(self.c));
        });
    });
};

Zipper.prototype.down = function() {
    var self = this;
    return this.r.tail().chain(function(a) {
        return self.r.head().map(function(b) {
            return Zipper(self.l.cons(self.c), b, a);
        });
    });
};

Zipper.prototype.beginning = function() {
    var self = this;
    return this.lastJust(function() {
        return self.up();
    });
};

Zipper.prototype.end = function() {
    var self = this;
    return this.lastJust(function() {
        return self.down();
    });
};

Zipper.prototype.map = function(f) {
    return Zipper(this.l.map(f), f(this.c), this.r.map(f));
};

Zipper.prototype.lastJust = function(f) {
    var self = this;
    return f().cata({
        None: constant(x),
        Some: function(x) {
            return x.lastJust(f);
        }
    });
};

Zipper.prototype.toSeq = function() {
    return this.l.concat(this.r.cons(this.c));
};

Zipper.prototype.toArray = function() {
    return this.toSeq().toArray();
};

// Export
if(typeof module != 'undefined')
    module.exports = Zipper;