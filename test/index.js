/* eslint-env mocha */

'use strict';

const path = require('path');
const fs = require('fs');
const {expect} = require('chai');

function strip(string) {
  return string.replace(/[\r\n]+/gm, ' ').replace(/\s+/gm, '');
}

async function readFile(file) {
  const {default:nn} = await import('normalize-newline');
  const contents = fs.readFileSync(path.join(__dirname, file), 'utf8');

  return nn(contents);
}

function fileExists(file) {
  return fs.existsSync(path.join(__dirname, file));
}

describe('critical', () => {
  it('generates minified critical-path CSS successfully', async () => {
    const expected = await readFile('expected/critical.css');
    const output = await readFile('generated/critical.css');

    expect(strip(output)).to.equal(strip(expected));
  });

  it('generates html with minified critical-path CSS successfully', async () => {
    const expected = await readFile('expected/index-minified.html');
    const output = await readFile('generated/index-critical.html');

    expect(strip(output)).to.equal(strip(expected));
  });

  it('generates html with minified critical-path CSS successfully ignoring bootstrap css', async () => {
    const expected = await readFile('expected/index-minified-ignore-bootstrap.html');
    const output = await readFile('generated/index-critical-ignore-bootstrap.html');

    expect(strip(output)).to.equal(strip(expected));
  });

  it('generates html with minified critical-path CSS for multiple dimensions successfully', async () => {
    const expected = await readFile('expected/index-dimensions.html');
    const output = await readFile('generated/index-dimensions.html');

    expect(strip(output)).to.equal(strip(expected));
  });

  it('generates html with extracted minified critical-path CSS successfully', async () => {
    const expected = await readFile('expected/index-extract.html');
    const output = await readFile('generated/index-critical-extract.html');

    expect(strip(output)).to.equal(strip(expected));
    expect(fileExists('fixture/styles/main.d41d8cd9.css')).to.equal(true);
    expect(fileExists('fixture/styles/bootstrap.6aac55ac.css')).to.equal(true);
  });

  it('generates multiple html files without throwing "warning: possible EventEmitter memory leak detected"', async () => {
    const expected = await readFile('expected/index-multiple.html');
    let output;

    for (let i = 1; i <= 5; i++) {
      output = await readFile(`generated/multiple/index${i}.html`);
      expect(strip(output)).to.equal(strip(expected.replace('<title>page x</title>', `<title>page ${i}</title>`)));
    }
  });

  it('generates multiple html files with minified CSS', async () => {
    const expected = await readFile('expected/index-multiple-minified.html');
    let output;

    for (let i = 1; i <= 5; i++) {
      output = await readFile(`generated/multiple-min/index${i}.html`);
      expect(strip(output)).to.equal(strip(expected.replace('<title>page x</title>', `<title>page ${i}</title>`)));
    }
  });

  it('should keep external URLs with extract option', async () => {
    const expected = await readFile('expected/index-external.html');
    const output = await readFile('generated/index-external.html');

    expect(strip(output)).to.equal(strip(expected));
    expect(fileExists('fixture/styles/main.d41d8cd9.css')).to.equal(true);
    expect(fileExists('fixture/styles/bootstrap.75a00fe7.css')).to.equal(true);
  });

  it('should write files to folder when folder is specified as dest', async () => {
    const expected = await readFile('expected/index-multiple.html');
    let output;

    for (let i = 1; i <= 5; i++) {
      expect(fileExists(`generated/multiple-files-folder/index${i}.html`)).to.equal(true);
      output = await readFile(`generated/multiple-files-folder/index${i}.html`);
      expect(strip(output)).to.equal(strip(expected.replace('<title>page x</title>', `<title>page ${i}</title>`)));
    }
  });

  it('should consider ignore option', async () => {
    const expected = await readFile('expected/critical-ignore.css');
    const output = await readFile('generated/critical-ignore.css');

    expect(strip(output)).to.equal(strip(expected));
  });

  it('should allow glob pattern for css option', async () => {
    const expected = await readFile('expected/critical.css');
    const output = await readFile('generated/critical-glob.css');

    expect(strip(output)).to.equal(strip(expected));
  });

  it('should allow remote sources', async () => {
    const expectedCss = await readFile('expected/critical.css');
    const expectedHtml = await readFile('expected/index-minified.html');
    const outputCss = await readFile('generated/remote.css');
    const outputHtml = await readFile('generated/remote.html');

    expect(strip(outputCss)).to.equal(strip(expectedCss));
    expect(strip(outputHtml)).to.equal(strip(expectedHtml));
  });
});
