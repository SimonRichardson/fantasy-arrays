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

function eq(a, b) {
    return a === b;
}

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
    return this.x.length === 0 ? x() : y(x[0], Sequence(x.slice(1)));
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
    return Sequence(a.x.concat(this.x));
};

Sequence.prototype.concatMap = function(f) {
    return this.chain(f);
};

Sequence.prototype.map = function(f) {
    var l = this.x.length,
        r = new Array(l),
        i;
    for(i = 0; i < l; i++) {
        r[i] = f(this.x[i]);
    }
    return Sequence(r);
};

Sequence.prototype.chain = function(f) {
    var r = [], 
        i, l, j, ll, a;
    for (i = 0, l = this.x.length; i < l; i++) {
        a = f(this.x[i]);
        for(j = 0, ll = a.x.length; j < ll; j++) {
            r.push(a.x[j]);
        }
    }
    return Sequence(r);
};

Sequence.prototype.filter = function(f) {
    return Sequence(this.x.filter(f));
};

Sequence.prototype.filterM = function(f) {
    return this._uncons(Sequence.empty, function(x, xs) {
        var a = f(x),
            b = xs.filterM(f);
        return a ? xs.cons(x) : b;
    });
};

Sequence.prototype.mapMaybe = function(f) {
    return this.concatMap(function(x) {
        return f.fold(Sequence.empty, singleton);
    });
};

Sequence.prototype.catMaybes = function() {
    return this.mapMaybe(identity);
};

Sequence.prototype.slice = function(a, b) {
    return Sequence(this.x.slice(a, b));
};

Sequence.prototype.take = function() {
    return this.slice(0);
};

Sequence.prototype.takeWhile = function(f) {
    return this.span(f).init;
};

Sequence.prototype.drop = function(n) {
    return n < 1 ? this : this.slice(n);
};

Sequence.prototype.dropWhile = function() {
    return this.span(f).rest;
};

Sequence.prototype.span = function(f) {
    var go = function(xs, acc) {
        return xs._uncons(
            function() {
                return {
                    init: acc.reverse(),
                    rest: xs
                };
            },
            function(h, t) {
                if (f(h)) {
                    return go(t, acc.cons(h));
                }
            }
        );
    };
    return go(this, Sequence.empty());
};

Sequence.prototype.group = function() {
    return this.groupBy(eq);
};

Sequence.prototype.groupBy = function(f) {
    var go = function(xs, acc) {
        return xs._uncons(
            function() {
                return acc.reverse();
            },
            function(h, t) {
                var sp = t.span(function(v) {
                    return f(h);
                });
                return go(sp.tail, acc.cons(sp.init.cons(h)));
            }
        );
    };
    return go(this, Sequence.empty());
};

Sequence.prototype.nub = function() {
    return this.numBy(eq);
};

Sequence.prototype.numBy = function(f) {
    return this._uncons(
        function() {
            return Sequence.empty();
        },
        function(h, t) {
            return t.filter(function(y) {
                return !eq(h, y);
            }).numBy(eq);
        }
    );
};

Sequence.prototype.zipWith = function(f, xs) {
    var l = this.x.length < xs.x.length ? this.x.length : xs.x.length,
        result = Sequence(new Array(l)),
        i;
    for (i = 0; i < l; i++) {
        result.x[i] = f(this.x[i], xs.x[i]);
    }
    return result;
};

Sequence.prototype.zip = function(x) {
    return this.zipWith(Tuple2, x);
};

Sequence.prototype.toArray = function() {
    return this.x;
};

// Export
if(typeof module != 'undefined')
    module.exports = Sequence;
