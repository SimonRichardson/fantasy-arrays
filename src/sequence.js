var daggy = require('daggy'),
    
    Sequence = daggy.tagged('x');

Sequence.of = function(x) {
    return Sequence([x]);
};

Sequence.singleton = function(x) {
    return Sequence.of(x);
};

Sequence.empty = function() {
    return Sequence([]);
};

Sequence.prototype.range = function(a, b) {
    var step = a > b ? -1 : 1,
        result = [],
        i, n;
    for(i = a, n = 0; i !== b; i += step) {
        result[n++] = i;
    }
    result[n] = i;
    return Sequence(result);
};

Sequence.prototype.replicate = function(n, v) {
    if (n < 1) return Sequence.empty();
    var r = Sequence(new Array(n)),
        i;
    for(i = 0; i < n; i++) {
        r.x[i] = v;
    }
    return r;
};

Sequence.prototype.replicateM = function(n, m) {
    if (n < 1) return Sequence.empty();
    return this.replicate(n).sequence();
};

Sequence.prototype.nil = function() {
    return this.length() === 0;
};

Sequence.prototype.length = function() {
    return this.x.length;
};

Sequence.prototype.cons = function(a) {
    return Sequence([a].concat(this.x));
};

Sequence.prototype.snoc = function(a) {
    var x = this.x.slice();
    x.push(a);
    return Sequence(x);
};

Sequence.prototype.head = function() {
    return this._uncons(constant(Option.None), Option.of);
};

Sequence.prototype.last = function() {
    return this.index(this.x.length - 1);
};

Sequence.prototype.tail = function() {
    return this._uncons(constant(Option.None), function(a, b) {
        return Option.of(b);
    });
};

Sequence.prototype.init = function() {
    return this.nil() ? Option.None : Just.of(this.slice(0, this.length() - 1));
};

Sequence.prototype.uncons = function(x, y) {
    return this._uncons(constant(Option.None), function(a, b) {
        return Option.Some({
            head: a,
            tail: b
        });
    });
};

Sequence.prototype._uncons = function(x, y) {
    return this.x.length === 0 ? x() : y(x[0], x.slice(1));
};

Sequence.prototype.index = function(x) {
    return x < 0 || x >= this.x.length ? Option.None : Option.of(this.x[x]);
};

Sequence.prototype.elemIndex = function(x) {
    return this.findIndex(function(y) {
        return x === y;
    });
};

Sequence.prototype.elemLastIndex = function(x) {
    return this.findLastIndex(function(y) {
        return x === y;
    });
};

Sequence.prototype.findIndex = function(f) {
    var i, l;
    for (i = 0, l = this.x.length; i < l; i++) {
        if (f(this.x[i])) {
            return Option.Some(i);
        }
    }
    return Option.None;
};

Sequence.prototype.findLastIndex = function(f) {
    var i;
    for (i = this.x.length - 1; i >= 0; i--) {
        if (f(this.x[i])) {
            return Option.Some(i);
        }
    }
    return Option.None;
};

Sequence.prototype.insertAt = function(a, b) {
    if (a < 0 || a > this.x.length) return Option.None;
    var r = this.x.slice();
    r.splice(a, 0, b);
    return Option.Some(Sequence(r));
};

Sequence.prototype.deleteAt = function(a) {
    if (a < 0 || a >= this.x.length) return Option.None;
    var r = this.x.slice();
    r.splice(a, 1);
    return Option.Some(Sequence(r));
};

Sequence.prototype.updateAt = function(a, b) {
    if (a < 0 || a >= this.x.length) return Option.None;
    var r = this.x.slice();
    r[a] = b;
    return Option.Some(Sequence(r));
};

Sequence.prototype.alterAt = function(a, b) {
    var self = this;
    return self.index(a).fold(
        function(x) {
            return self.updateAt(a, x);
        },
        function() {
            return self.deleteAt(a);
        }
    );
};

Sequence.prototype.reverse = function() {
    return Sequence(this.x.slice().reverse());
};

Sequence.prototype.concat = function(a) {
    return Sequence([].concat(a.x).concat(this.x));
};

// Export
if(typeof module != 'undefined')
    module.exports = Sequence;
