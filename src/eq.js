var helpers = require('fantasy-helpers');

// Export
if(typeof module != 'undefined')
    module.exports = function(a, b) {
        return helpers.strictEquals(a)(b);
    };