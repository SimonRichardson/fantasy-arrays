var λ       = require('fantasy-check/src/adapters/nodeunit'),
    functor = require('fantasy-check/src/laws/functor'),

    combinators = require('fantasy-combinators'),
    arrays      = require('../fantasy-arrays'),

    Sequence = arrays.Sequence,
    identity = combinators.identity;

function run(x) {
    return x.toArray();
}

exports.sequence = {
    
    // Functor tests
    'All (Functor)': functor.laws(λ)(Sequence.of, run),
    'Identity (Functor)': functor.identity(λ)(Sequence.of, run),
    'Composition (Functor)': functor.composition(λ)(Sequence.of, run)
};