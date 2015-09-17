var daggy       = require('daggy'),
    combinators = require('fantasy-combinators'),

    constant = combinators.constant,
    identity = combinators.identity,
    
    List = daggy.taggedSum({
        Cons: ['x', 'xs'],
        Nil : []
    });

List.of = function(x) {
    return List.Cons(x, List.Nil);
};

List.singleton = List.of;

List.empty = function(x) {
    return List.Nil;
};

List.range = function(a, b) {
    if (a == b) return List.singleton(a);
    var go = function(s, e, step, rest) {
        if (s == e) return List.Cons(s, rest);
        return go(s + step, e, step, List.Cons(s, rest));
    };
    return go(b, a, start > end ? 1 : -1, List.Nil);
};

List.prototype.replicate = function(n, v) {
    var go = function(n, rest) {
        return n <= 0 ? rest : go(n - 1, List.Cons(v, rest));
    };
    return go(n, List.Nil);
};

List.prototype.replicateM = function(n, m) {
    if (n < 1) return List.Nil;
    return m.chain(function(x) {
        return List.Cons(x, replicateM(n - 1, m));
    });
};

List.prototype.nil = function() {
    return this.cata({
        Nil: constant(true),
        Cons: constant(false)
    });
};

List.prototype.length = function() {
    return this.foldl(function(x, y) {
        return x + 1;
    }, 0);
};

List.prototype.cons = function(a) {
    return List.Cons(a, this);
};

List.prototype.snoc = function(a) {
    return List.Cons(a, this.reverse()).reverse();
};

List.prototype.head = function() {
    return this.cata({
        Nil: constant(Option.None),
        Cons: function(x, xs) {
            return Option.Some(x);
        }
    });
};

List.prototype.last = function() {
    return this.cata({
        Nil: constant(Option.None),
        Cons: function(x, xs) {
            return xs.cata({
                Nil: constant(x),
                Cons: function() {
                    return xs.last();
                }
            });
        }
    });
};

List.prototype.tail = function() {
    return this.cata({
        Nil: constant(Option.None),
        Cons: function(x, xs) {
            return Option.Some(xs);
        }
    });
};

List.prototype.init = function() {
    var self = this,
        go = function(x, acc) {
            return x.cata({
                Nil: constant(acc),
                Cons: function(x, xs) {
                    return xs.cata({
                        Nil: constant(acc),
                        Cons: function() {
                            return go(xs, List.Cons(x, acc));
                        }
                    });
                }
            });
        };
    return this.cata({
        Nil: constant(Option.None),
        Cons: function(x, xs) {
            return Option.Some(go(self, List.Nil).reverse());
        }
    });
};

List.prototype.uncons = function() {
    return this.cata({
        Nil: constant(Option.None),
        Cons: function(x, xs) {
            return Option.Some({
                head: x,
                tail: xs
            });
        }
    });
};

List.prototype.index = function(x) {
    return this.cata({
        Nil: constant(Option.None),
        Cons: function(a, b) {
            return x === 0 ? Option.Some(a) : b.index(x - 1);
        }
    });
};

List.prototype.elemIndex = function(x) {
    return this.findIndex(function(y) {
        return x === y;
    });
};

List.prototype.elemLastIndex = function(x) {
    return this.findLastIndex(function(y) {
        return x === y;
    });
};

List.prototype.findIndex = function(f) {
    var go = function(x, n) {
        return x.cata({
            Nil: constant(Option.None),
            Cons: function(x, xs) {
                return f(x) ? Option.Some(n) : go(xs, n + 1);
            }
        });
    };
    return go(this, 0);
};

List.prototype.findLastIndex = function(f) {
    var self = this;
    return this.reverse().findIndex(f).map(function(x) {
        return (self.length() - 1) - x;
    });
};

List.prototype.insertAt = function(a, b) {
    return this.cata({
        Nil: constant(Option.None),
        Cons: function(x, xs) {
            return a === 0 ? 
                Option.Some(List.Cons(a, b)) : 
                xs.insertAt(a - 1, b).map(function(y) {
                    return List.Cons(x, y);
                });
        }
    });
};

List.prototype.deleteAt = function(a) {
    return this.cata({
        Nil: constant(Option.None),
        Cons: function(x, xs) {
            return a === 0 ? 
                Option.Some(xs) : 
                xs.deleteAt(a - 1).map(function(y) {
                    return List.Cons(x, y);
                });
        }
    });
};

List.prototype.updateAt = function(a, b) {
    return this.cata({
        Nil: constant(Option.None),
        Cons: function(x, xs) {
            return a === 0 ? 
                Option.Some(List.Cons(b, xs)) :
                xs.updateAt(a - 1, b).map(function(y) {
                    return List.Cons(x, y);
                });
        }
    });
};

List.prototype.modifyAt = function(n, f) {
    return this.alterAt(n, function(x) {
        return Option.Some(f(x));
    });
};

List.prototype.alterAt = function(n, f) {
    return this.cata({
        Nil: constant(Option.None),
        Cons: function(x, xs) {
            return n === 0 ? 
                Option.Some(f(x).cata({
                    None: constant(xs),
                    Some: function(y) {
                        return List.Cons(y, xs);
                    }
                })) :
                xs.alterAt(n - 1, f).map(function(y) {
                    return List.Cons(x, y);
                });
        }
    });
};

List.prototype.reverse = function() {
    var go = function(x, acc) {
        return x.cata({
            Nil: constant(acc),
            Cons: function(x, xs) {
                return go(xs, List.Cons(x, acc));
            }
        });
    };
    return go(this, List.Nil);
};

List.prototype.concat = function(a) {
    var go = function(x, y) {
        return x.cata({
            Nil: constant(y),
            Cons: function(a, b) {
                return go(b, List.Cons(a, y));
            }
        });
    };
    return go(this.reverse(), a);
};

List.prototype.concatMap = function(f) {
    return this.cata({
        Nil: constant(List.Nil),
        Cons: function(x, xs) {
            return xs.concatMap(f).concat(f(x));
        }
    });
};

List.prototype.map = function(f) {
    var go = function(x, acc) {
        return x.cata({
            Nil: constant(acc),
            Cons: function(x, xs) {
                return go(xs, List.Cons(f(x), acc));
            }
        });
    };
    return go(this, List.Nil).reverse();
};

List.prototype.chain = function(f) {
    return this;
};

List.prototype.filter = function(f) {
    var go = function(x, acc) {
        return x.cata({
            Nil: function() {
                return acc.reverse();
            },
            Cons: function(x, xs) {
                return f(x) ? 
                    go(xs, List.Cons(x, acc)) :
                    go(xs, acc);
            }
        });
    };
    return go(this, List.Nil);
};

List.prototype.filterM = function(f) {
    return this.cata({
        Nil: constant(List.Nil),
        Cons: function(x, xs) {
            var ys = xs.filterM(f);
            return f(x) ? List.Cons(x, ys) : ys;
        }
    });
};

List.prototype.mapMaybe = function(f) {
    var go = function(x, acc) {
        return x.cata({
            Nil: function() {
                return acc.reverse();
            },
            Cons: function(x, xs) {
                return f(x).cata({
                    None: function() {
                        return go(xs, acc);
                    },
                    Some: function(y) {
                        return go(xs, List.Cons(y, acc));
                    }
                });
            }
        });
    };
    return go(this, List.Nil);
};

List.prototype.catMaybes = function() {
    return this.mapMaybe(identity);
};

List.prototype.slice = function(a, b) {
    return this.take(b - a, this.drop(a));
};

List.prototype.take = function(a) {
    var go = function(x, n, acc) {
        return n === 0 ? acc.reverse() :
            x.cata({
                Nil: function() {
                    return acc.reverse();
                },
                Cons: function(x, xs) {
                    return go(xs, n - 1, List.Cons(x, acc));
                }
            });
    };
    return go(this, a, List.Nil);
};

List.prototype.takeWhile = function(f) {
    var go = function(x, acc) {
        return x.cata({
            Nil: function() {
                return acc.reverse();
            },
            Cons: function(x, xs) {
                return f(x) ? go(xs, List.Cons(x, acc)) : acc.reverse();
            }
        });
    };
    return go(this, List.Nil);
};

List.prototype.drop = function(n) {
    return n === 0 ? this : 
        x.cata({
            Nil: constant(List.Nil),
            Cons: function(x, xs) {
                return xs.drop(n - 1);
            }
        });
};

List.prototype.dropWhile = function(f) {
    var go = function(x) {
        return x.cata({
            Nil: constant(x),
            Cons: function(y, xs) {
                return f(y) ? go(xs) : x;
            }
        });
    };
    return go(this);
};

List.prototype.span = function(f) {
    var self = this,
        rest = function() {
            return {
                init: List.Nil,
                rest: self
            };
        },
        add = function(x, h) {
            return {
                init: List.Cons(x, h.init),
                rest: h.rest
            };
        };
    return this.cata({
        Nil: rest,
        Cons: function(x, xs) {
            return f(x) ? add(x, xs.span(f)) : rest();
        }
    });
};

List.prototype.group = function() {
    return this.groupBy(eq);
};

List.prototype.groupBy = function(f) {
    var add = function(h) {
        return List.Cons(List.Cons(x, h.init), h.rest.groupBy(eq));
    };
    return this.cata({
        Nil: constant(List.Nil),
        Cons: function(x, xs) {
            return add(xs.span(function(y) {
                return eq(x, y);
            }));
        }
    });
};

List.prototype.toArray = function() {
    var go = function(x, acc) {
        return x.cata({
            Nil: constant(acc),
            Cons: function(x, xs) {
                return go(xs, acc.concat([x]));
            }
        });
    };
    return go(this, []);
};

// Export
if(typeof module != 'undefined')
    module.exports = List;