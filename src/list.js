var daggy       = require('daggy'),
    combinators = require('fantasy-combinators'),

    constant = combinators.constant,
    
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