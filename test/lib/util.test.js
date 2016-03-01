var assert = require('assert');
var _ = require('../../lib/util');


describe('util.map', function() {
    it('return correct array', function () {
        var obj = {
            a: 1,
            b: 2
        };
        var result = _.map(obj, function (v, k, i) {
            return [k, v].join('=');
        });
        console.log(result);
        assert.equal(result.join(','), 'a=1,b=2');
    });
});

describe('util.merge', function() {
    it('{a: 1} merge {b: 1}', function () {
        var obj = {
            a: 1
        };
        var result = _.merge(obj, {b: 1});
        console.log(result);
        assert.equal(result.a, result.b);
    });
});
