var λ           = require('fantasy-check/src/adapters/nodeunit'),
    applicative = require('fantasy-check/src/laws/applicative'),
    functor     = require('fantasy-check/src/laws/functor'),
    monad       = require('fantasy-check/src/laws/monad'),
    monoid      = require('fantasy-check/src/laws/monoid'),
    semigroup   = require('fantasy-check/src/laws/semigroup'),

    combinators = require('fantasy-combinators'),
    arrays      = require('../fantasy-arrays'),

    List = arrays.List,
    identity = combinators.identity;

function run(x) {
    return x.toArray();
}

exports.list = {
    
    // Applicative Functor tests
    'All (Applicative)': applicative.laws(λ)(List, run),
    'Identity (Applicative)': applicative.identity(λ)(List, run),
    'Composition (Applicative)': applicative.composition(λ)(List, run),
    'Homomorphism (Applicative)': applicative.homomorphism(λ)(List, run),
    'Interchange (Applicative)': applicative.interchange(λ)(List, run),

    // Functor tests
    'All (Functor)': functor.laws(λ)(List.of, run),
    'Identity (Functor)': functor.identity(λ)(List.of, run),
    'Composition (Functor)': functor.composition(λ)(List.of, run),

    // Monad tests
    'All (Monad)': monad.laws(λ)(List, run),
    'Left Identity (Monad)': monad.leftIdentity(λ)(List, run),
    'Right Identity (Monad)': monad.rightIdentity(λ)(List, run),
    'Associativity (Monad)': monad.associativity(λ)(List, run),

    // Monoid tests
    'All (Monoid)': monoid.laws(λ)(List, run),
    'leftIdentity (Monoid)': monoid.leftIdentity(λ)(List, run),
    'rightIdentity (Monoid)': monoid.rightIdentity(λ)(List, run),
    'associativity (Monoid)': monoid.associativity(λ)(List, run),

    // Semigroup tests
    'All (Semigroup)': semigroup.laws(λ)(List.of, run),
    'associativity (Semigroup)': semigroup.associativity(λ)(List.of, run),
};