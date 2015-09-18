var λ           = require('fantasy-check/src/adapters/nodeunit'),
    functor     = require('fantasy-check/src/laws/functor'),
    
    combinators = require('fantasy-combinators'),
    arrays      = require('./../../fantasy-arrays'),

    Seq      = arrays.zippers.Seq,
    identity = combinators.identity;

function run(x) {
    return x.toArray();
}

exports.seq = {
    
    // Functor tests
    'All (Functor)': functor.laws(λ)(Seq.of, run),
    'Identity (Functor)': functor.identity(λ)(Seq.of, run),
    'Composition (Functor)': functor.composition(λ)(Seq.of, run)
};