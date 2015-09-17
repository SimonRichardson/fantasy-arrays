var λ         = require('fantasy-check/src/adapters/nodeunit'),
    functor   = require('fantasy-check/src/laws/functor'),
    monad     = require('fantasy-check/src/laws/monad'),
    monoid    = require('fantasy-check/src/laws/monoid'),
    semigroup = require('fantasy-check/src/laws/semigroup'),

    combinators = require('fantasy-combinators'),
    arrays      = require('../fantasy-arrays'),

    Seq      = arrays.Seq,
    identity = combinators.identity;

function run(x) {
    return x.toArray();
}

exports.seq = {
    
    // Functor tests
    'All (Functor)': functor.laws(λ)(Seq.of, run),
    'Identity (Functor)': functor.identity(λ)(Seq.of, run),
    'Composition (Functor)': functor.composition(λ)(Seq.of, run),

    // Monad tests
    'All (Monad)': monad.laws(λ)(Seq, run),
    'Left Identity (Monad)': monad.leftIdentity(λ)(Seq, run),
    'Right Identity (Monad)': monad.rightIdentity(λ)(Seq, run),
    'Associativity (Monad)': monad.associativity(λ)(Seq, run),

    // Monoid tests
    'All (Monoid)': monoid.laws(λ)(Seq, run),
    'leftIdentity (Monoid)': monoid.leftIdentity(λ)(Seq, run),
    'rightIdentity (Monoid)': monoid.rightIdentity(λ)(Seq, run),
    'associativity (Monoid)': monoid.associativity(λ)(Seq, run),

    // Semigroup tests
    'All (Semigroup)': semigroup.laws(λ)(Seq.of, run),
    'associativity (Semigroup)': semigroup.associativity(λ)(Seq.of, run)
};