var λ       = require('fantasy-check/src/adapters/nodeunit'),
    functor = require('fantasy-check/src/laws/functor'),

    combinators = require('fantasy-combinators'),
    arrays      = require('../fantasy-arrays'),

    NonEmpty = arrays.NonEmpty,
    identity = combinators.identity;

function run(x) {
    return x.toArray();
}

exports.nonempty = {
    
    // Functor tests
    'All (Functor)': functor.laws(λ)(NonEmpty.of, run),
    'Identity (Functor)': functor.identity(λ)(NonEmpty.of, run),
    'Composition (Functor)': functor.composition(λ)(NonEmpty.of, run)
};