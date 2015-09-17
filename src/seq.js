var daggy       = require('daggy'),
    combinators = require('fantasy-combinators'),
    tuples      = require('fantasy-tuples'),
    Option      = require('fantasy-options'),
    eq          = require('./eq'),

    constant = combinators.constant,
    identity = combinators.identity,

    Tuple2 = tuples.Tuple2,
    
    Seq = daggy.tagged('x');

Seq.of = function(x) {
    return Seq([x]);
};

Seq.singleton = Seq.of;

Seq.empty = function() {
    return Seq([]);
};

Seq.range = function(a, b) {
    var step = a > b ? -1 : 1,
        result = [],
        i, n;
    for(i = a, n = 0; i !== b; i += step) {
        result[n++] = i;
    }
    result[n] = i;
    return Seq(result);
};

Seq.prototype.replicate = function(n, v) {
    if (n < 1) return Seq.empty();
    var r = Seq(new Array(n)),
        i;
    for(i = 0; i < n; i++) {
        r.x[i] = v;
    }
    return r;
};

Seq.prototype.replicateM = function(n, m) {
    if (n < 1) return Seq.empty();
    return this.replicate(n).sequence();
};

Seq.prototype.nil = function() {
    return this.x.length < 1;
};

Seq.prototype.length = function() {
    return this.x.length;
};

Seq.prototype.cons = function(a) {
    return Seq([a].concat(this.x));
};

Seq.prototype.snoc = function(a) {
    var x = this.x.slice();
    x.push(a);
    return Seq(x);
};

Seq.prototype.head = function() {
    return this._uncons(constant(Option.None), Option.of);
};

Seq.prototype.last = function() {
    return this.index(this.x.length - 1);
};

Seq.prototype.tail = function() {
    return this._uncons(constant(Option.None), function(a, b) {
        return Option.of(b);
    });
};

Seq.prototype.init = function() {
    return this.nil() ? Option.None : Just.of(this.slice(0, this.length() - 1));
};

Seq.prototype.uncons = function(x, y) {
    return this._uncons(constant(Option.None), function(a, b) {
        return Option.Some({
            head: a,
            tail: b
        });
    });
};

Seq.prototype._uncons = function(x, y) {
    return this.x.length === 0 ? x() : y(x[0], Seq(x.slice(1)));
};

Seq.prototype.index = function(x) {
    return x < 0 || x >= this.x.length ? Option.None : Option.of(this.x[x]);
};

Seq.prototype.elemIndex = function(x) {
    return this.findIndex(function(y) {
        return x === y;
    });
};

Seq.prototype.elemLastIndex = function(x) {
    return this.findLastIndex(function(y) {
        return x === y;
    });
};

Seq.prototype.findIndex = function(f) {
    var i, l;
    for (i = 0, l = this.x.length; i < l; i++) {
        if (f(this.x[i])) {
            return Option.Some(i);
        }
    }
    return Option.None;
};

Seq.prototype.findLastIndex = function(f) {
    var i;
    for (i = this.x.length - 1; i >= 0; i--) {
        if (f(this.x[i])) {
            return Option.Some(i);
        }
    }
    return Option.None;
};

Seq.prototype.insertAt = function(a, b) {
    if (a < 0 || a > this.x.length) return Option.None;
    var r = this.x.slice();
    r.splice(a, 0, b);
    return Option.Some(Seq(r));
};

Seq.prototype.deleteAt = function(a) {
    if (a < 0 || a >= this.x.length) return Option.None;
    var r = this.x.slice();
    r.splice(a, 1);
    return Option.Some(Seq(r));
};

Seq.prototype.updateAt = function(a, b) {
    if (a < 0 || a >= this.x.length) return Option.None;
    var r = this.x.slice();
    r[a] = b;
    return Option.Some(Seq(r));
};

Seq.prototype.modifyAt = function(n, f) {
    return this.alterAt(n, function(x) {
        return Option.Some(f(x));
    });
};

Seq.prototype.alterAt = function(n, f) {
    var self = this;
    return self.index(n).fold(
        function(x) {
            return f(x).chain(function(y) {
                return self.updateAt(n, y);
            });
        },
        function() {
            return self.deleteAt(n);
        }
    );
};

Seq.prototype.reverse = function() {
    return Seq(this.x.slice().reverse());
};

Seq.prototype.concat = function(a) {
    return Seq(a.x.concat(this.x));
};

Seq.prototype.concatMap = function(f) {
    return this.chain(f);
};

Seq.prototype.map = function(f) {
    var l = this.x.length,
        r = new Array(l),
        i;
    for(i = 0; i < l; i++) {
        r[i] = f(this.x[i]);
    }
    return Seq(r);
};

Seq.prototype.chain = function(f) {
    var r = [], 
        i, l, j, ll, a;
    for (i = 0, l = this.x.length; i < l; i++) {
        a = f(this.x[i]);
        for(j = 0, ll = a.x.length; j < ll; j++) {
            r.push(a.x[j]);
        }
    }
    return Seq(r);
};

Seq.prototype.filter = function(f) {
    return Seq(this.x.filter(f));
};

Seq.prototype.filterM = function(f) {
    return this._uncons(Seq.empty, function(x, xs) {
        var a = f(x),
            b = xs.filterM(f);
        return a ? xs.cons(x) : b;
    });
};

Seq.prototype.mapMaybe = function(f) {
    return this.concatMap(function(x) {
        return f.fold(Seq.empty, singleton);
    });
};

Seq.prototype.catMaybes = function() {
    return this.mapMaybe(identity);
};

Seq.prototype.slice = function(a, b) {
    return Seq(this.x.slice(a, b));
};

Seq.prototype.take = function() {
    return this.slice(0);
};

Seq.prototype.takeWhile = function(f) {
    return this.span(f).init;
};

Seq.prototype.drop = function(n) {
    return n < 1 ? this : this.slice(n);
};

Seq.prototype.dropWhile = function() {
    return this.span(f).rest;
};

Seq.prototype.span = function(f) {
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
    return go(this, Seq.empty());
};

Seq.prototype.group = function() {
    return this.groupBy(eq);
};

Seq.prototype.groupBy = function(f) {
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
    return go(this, Seq.empty());
};

Seq.prototype.nub = function() {
    return this.nubBy(eq);
};

Seq.prototype.nubBy = function(f) {
    return this._uncons(
        function() {
            return Seq.empty();
        },
        function(h, t) {
            return t.filter(function(y) {
                return !eq(h, y);
            }).numBy(eq);
        }
    );
};

Seq.prototype.zipWith = function(f, xs) {
    var l = this.x.length < xs.x.length ? this.x.length : xs.x.length,
        result = Seq(new Array(l)),
        i;
    for (i = 0; i < l; i++) {
        result.x[i] = f(this.x[i], xs.x[i]);
    }
    return result;
};

Seq.prototype.zip = function(x) {
    return this.zipWith(Tuple2, x);
};

Seq.prototype.toArray = function() {
    return this.x;
};

// Export
if(typeof module != 'undefined')
    module.exports = Seq;
