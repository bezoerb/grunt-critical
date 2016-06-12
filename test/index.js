/* jshint mocha: true */

'use strict';

var expect = require('chai').expect,
    path = require('path'),
    fs = require('fs');


function strip(string) {
    return string.replace(/[\r\n]+/mg, ' ').replace(/\s+/gm, '');
}

function read(file) {
    var contents = strip(fs.readFileSync(path.join(__dirname, file), 'utf8'));
    if (process.platform === 'win32') {
        contents = contents.replace(/\r\n/g, '\n');
    }
    return contents;
}

function exists(file) {
    return fs.existsSync(path.join(__dirname, file));
}

describe('critical', function() {
    it('generates minified critical-path CSS successfully', function () {
        var expected = read('expected/critical.css');
        var output = read('generated/critical.css');
        expect(output).to.equal(expected);
    });

    it('generates html with minified critical-path CSS successfully', function () {
        var expected = read('expected/index-minified.html');
        var output = read('generated/index-critical.html');
        expect(output).to.equal(expected);
    });

    it('generates html with minified critical-path CSS for multiple dimensions successfully', function () {
        var expected = read('expected/index-dimensions.html');
        var output = read('generated/index-dimensions.html');
        expect(output).to.equal(expected);
    });

    it('generates html with extracted minified critical-path CSS successfully', function () {
        var expected = read('expected/index-extract.html');
        var output = read('generated/index-critical-extract.html');
        expect(output).to.equal(expected);
        expect(exists('fixture/styles/main.b5ff4680.css')).to.equal(true);
        expect(exists('fixture/styles/bootstrap.232286a8.css')).to.equal(true);
    });

    it('generates multiple html files without throwing "warning: possible EventEmitter memory leak detected"', function() {
        var expected = read('expected/index-multiple.html');
        var output;
        for (var i = 1; i <= 5; i++) {
            output = read('generated/multiple/index' + i + '.html');
            expect(output).to.equal(expected.replace('<title>pagex</title>', '<title>page' + i + '</title>'));
        }
    });

    it('generates multiple html files with minified css', function() {
        var expected = read('expected/index-multiple-minified.html');
        var output;
        for (var i = 1; i <= 12; i++) {
            output = read('generated/multiple-min/index' + i + '.html');
            expect(output).to.equal(expected.replace('<title>pagex</title>', '<title>page' + i + '</title>'));
        }
    });

    it('should keep external urls with extract option', function() {
        var expected = read('expected/index-external.html');
        var output = read('generated/index-external.html');
        expect(output).to.equal(expected);

        expect(exists('fixture/styles/main.b5ff4680.css')).to.equal(true);
        expect(exists('fixture/styles/bootstrap.ab96ce64.css')).to.equal(true);
    });

    it('should write files to folder when folder is specified as dest', function() {
        var expected = read('expected/index-multiple.html');
        var output;
        for (var i = 1; i <= 3; i++) {
            expect(exists('generated/multiple-files-folder/index' + i + '.html')).to.equal(true);
            output = read('generated/multiple-files-folder/index' + i + '.html');
            expect(output).to.equal(expected.replace('<title>pagex</title>', '<title>page' + i + '</title>'));
        }
    });

    it('should consider ignore option', function() {
        var expected = read('expected/critical-ignore.css');
        var output = read('generated/critical-ignore.css');
        expect(output).to.equal(expected);
    });

    it('should allow glob pattern for css option', function() {
        var expected = read('expected/critical.css');
        var output1 = read('generated/critical-glob.css');
        var output2 = read('generated/critical-glob2.css');
        expect(output1).to.equal(expected);
        expect(output2).to.equal(expected);
    });

    it('should allow remote sources', function() {
        var expectedCss = read('expected/critical.css');
        var expectedHtml = read('expected/index-minified.html');
        var outputCss = read('generated/remote.css');
        var outputHtml = read('generated/remote.html');
        expect(outputCss).to.equal(expectedCss);
        expect(outputHtml).to.equal(expectedHtml);
    });

});
