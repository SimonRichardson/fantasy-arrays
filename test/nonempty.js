var λ           = require('fantasy-check/src/adapters/nodeunit'),
    applicative = require('fantasy-check/src/laws/applicative'),
    functor     = require('fantasy-check/src/laws/functor'),
    monad       = require('fantasy-check/src/laws/monad'),
    semigroup   = require('fantasy-check/src/laws/semigroup'),

    combinators = require('fantasy-combinators'),
    arrays      = require('../fantasy-arrays'),

    NonEmpty = arrays.NonEmpty,
    identity = combinators.identity;

function run(x) {
    return x.toArray();
}

exports.nonempty = {
    
    // Applicative Functor tests
    'All (Applicative)': applicative.laws(λ)(NonEmpty, run),
    'Identity (Applicative)': applicative.identity(λ)(NonEmpty, run),
    'Composition (Applicative)': applicative.composition(λ)(NonEmpty, run),
    'Homomorphism (Applicative)': applicative.homomorphism(λ)(NonEmpty, run),
    'Interchange (Applicative)': applicative.interchange(λ)(NonEmpty, run),

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