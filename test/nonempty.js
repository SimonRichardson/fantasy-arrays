var λ         = require('fantasy-check/src/adapters/nodeunit'),
    functor   = require('fantasy-check/src/laws/functor'),
    monad     = require('fantasy-check/src/laws/monad'),
    semigroup = require('fantasy-check/src/laws/semigroup'),

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
    'Composition (Functor)': functor.composition(λ)(NonEmpty.of, run),

    // Monad tests
    'All (Monad)': monad.laws(λ)(NonEmpty, run),
    'Left Identity (Monad)': monad.leftIdentity(λ)(NonEmpty, run),
    'Right Identity (Monad)': monad.rightIdentity(λ)(NonEmpty, run),
    'Associativity (Monad)': monad.associativity(λ)(NonEmpty, run),

    // Semigroup tests
    'All (Semigroup)': semigroup.laws(λ)(NonEmpty.of, run),
    'associativity (Semigroup)': semigroup.associativity(λ)(NonEmpty.of, run)
};