var expect = require('chai').expect,
    fs = require('fs');

describe('critical',function(){
    it('generates minified critical-path CSS successfully', function () {
        var expected = fs.readFileSync('test/fixture/styles/critical-pregenerated.css', 'utf8');
        var output = fs.readFileSync('test/generated/critical.css', 'utf8');


        expect(output).to.equal(expected);
    });

});