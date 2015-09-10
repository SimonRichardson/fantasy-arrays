var λ       = require('fantasy-check/src/adapters/nodeunit'),
    functor = require('fantasy-check/src/laws/functor'),

    combinators = require('fantasy-combinators'),
    arrays      = require('../fantasy-arrays'),

    NonEmpty = arrays.NonEmpty,
    identity = combinators.identity;

exports.nonempty = {
    
    // Functor tests
    'All (Functor)': functor.laws(λ)(NonEmpty.of, identity),
    'Identity (Functor)': functor.identity(λ)(NonEmpty.of, identity),
    'Composition (Functor)': functor.composition(λ)(NonEmpty.of, identity)
};