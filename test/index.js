/* jshint mocha: true */

'use strict';

var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');

function readFile(file) {
    var contents = fs.readFileSync(path.join(__dirname, file), 'utf8');

    if (process.platform === 'win32') {
        contents = contents.replace(/\r\n/g, '\n');
    }
    return contents;
}

function fileExists(file) {
    return fs.existsSync(path.join(__dirname, file));
}

describe('critical', function() {
    it('generates minified critical-path CSS successfully', function () {
        var expected = readFile('expected/critical.css');
        var output = readFile('generated/critical.css');

        expect(output).to.equal(expected);
    });

    it('generates html with minified critical-path CSS successfully', function () {
        var expected = readFile('expected/index-minified.html');
        var output = readFile('generated/index-critical.html');

        expect(output).to.equal(expected);
    });

    it('generates html with minified critical-path CSS for multiple dimensions successfully', function () {
        var expected = readFile('expected/index-dimensions.html');
        var output = readFile('generated/index-dimensions.html');

        expect(output).to.equal(expected);
    });

    it('generates html with extracted minified critical-path CSS successfully', function () {
        var expected = readFile('expected/index-extract.html');
        var output = readFile('generated/index-critical-extract.html');

        expect(output).to.equal(expected);
        expect(fileExists('fixture/styles/main.b5ff4680.css')).to.equal(true);
        expect(fileExists('fixture/styles/bootstrap.232286a8.css')).to.equal(true);
    });

    it('generates multiple html files without throwing "warning: possible EventEmitter memory leak detected"', function() {
        var expected = readFile('expected/index-multiple.html');
        var output;

        for (var i = 1; i <= 5; i++) {
            output = readFile('generated/multiple/index' + i + '.html');
            expect(output).to.equal(expected.replace('<title>page x</title>', '<title>page ' + i + '</title>'));
        }
    });

    it('generates multiple html files with minified CSS', function() {
        var expected = readFile('expected/index-multiple-minified.html');
        var output;

        for (var i = 1; i <= 12; i++) {
            output = readFile('generated/multiple-min/index' + i + '.html');
            expect(output).to.equal(expected.replace('<title>page x</title>', '<title>page ' + i + '</title>'));
        }
    });

    it('should keep external URLs with extract option', function() {
        var expected = readFile('expected/index-external.html');
        var output = readFile('generated/index-external.html');

        expect(output).to.equal(expected);
        expect(fileExists('fixture/styles/main.b5ff4680.css')).to.equal(true);
        expect(fileExists('fixture/styles/bootstrap.ab96ce64.css')).to.equal(true);
    });

    it('should write files to folder when folder is specified as dest', function() {
        var expected = readFile('expected/index-multiple.html');
        var output;

        for (var i = 1; i <= 3; i++) {
            expect(fileExists('generated/multiple-files-folder/index' + i + '.html')).to.equal(true);
            output = readFile('generated/multiple-files-folder/index' + i + '.html');
            expect(output).to.equal(expected.replace('<title>page x</title>', '<title>page ' + i + '</title>'));
        }
    });

    it('should consider ignore option', function() {
        var expected = readFile('expected/critical-ignore.css');
        var output = readFile('generated/critical-ignore.css');

        expect(output).to.equal(expected);
    });

    it('should allow glob pattern for css option', function() {
        var expected = readFile('expected/critical.css');
        var output1 = readFile('generated/critical-glob.css');
        var output2 = readFile('generated/critical-glob2.css');

        expect(output1).to.equal(expected);
        expect(output2).to.equal(expected);
    });

    it('should allow remote sources', function() {
        var expectedCss = readFile('expected/critical.css');
        var expectedHtml = readFile('expected/index-minified.html');
        var outputCss = readFile('generated/remote.css');
        var outputHtml = readFile('generated/remote.html');

        expect(outputCss).to.equal(expectedCss);
        expect(outputHtml).to.equal(expectedHtml);
    });

});
