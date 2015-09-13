var λ       = require('fantasy-check/src/adapters/nodeunit'),
    functor = require('fantasy-check/src/laws/functor'),

    combinators = require('fantasy-combinators'),
    arrays      = require('../fantasy-arrays'),

    List = arrays.List,
    identity = combinators.identity;

function run(x) {
    return x.toArray();
}

exports.nonempty = {
    
    // Functor tests
    'All (Functor)': functor.laws(λ)(List.of, run),
    'Identity (Functor)': functor.identity(λ)(List.of, run),
    'Composition (Functor)': functor.composition(λ)(List.of, run)
};