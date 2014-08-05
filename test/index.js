var expect = require('chai').expect,
    fs = require('fs');

/**
 * Strip whitespaces, tabs and newlines and replace with one space.
 * Usefull when comparing string contents.
 * @param string
 */
function stripWhitespace(string) {
    return string.replace(/[\r\n]+/mg,' ').replace(/\s+/gm,'');
}

describe('critical',function(){
    it('generates minified critical-path CSS successfully', function () {
        var expected = stripWhitespace(fs.readFileSync('test/fixture/styles/critical-pregenerated.css', 'utf8'));
        var output = stripWhitespace(fs.readFileSync('test/generated/critical.css', 'utf8'));
        expect(output).to.equal(expected);
    });


    it('generates html with minified critical-path CSS successfully', function () {
        var expected = stripWhitespace(fs.readFileSync('test/fixture/index-inlined-minified.html', 'utf8'));
        var output = stripWhitespace(fs.readFileSync('test/generated/index-critical.html', 'utf8'));
        expect(output).to.equal(expected);
    });

});