/* eslint-env mocha */

"use strict";

const path = require("path");
const fs = require("fs");
const nn = require("normalize-newline");
const { expect } = require("chai");

function readFile(file) {
    let contents = fs.readFileSync(path.join(__dirname, file), "utf8");

    return nn(contents);
}

function fileExists(file) {
    return fs.existsSync(path.join(__dirname, file));
}

describe("critical", () => {
    it("generates minified critical-path CSS successfully", () => {
        const expected = readFile("expected/critical.css");
        const output = readFile("generated/critical.css");

        expect(output).to.equal(expected);
    });

    it("generates html with minified critical-path CSS successfully", () => {
        const expected = readFile("expected/index-minified.html");
        const output = readFile("generated/index-critical.html");

        expect(output).to.equal(expected);
    });

    it("generates html with minified critical-path CSS successfully ignoring bootstrap css", () => {
        const expected = readFile(
            "expected/index-minified-ignore-bootstrap.html"
        );
        const output = readFile(
            "generated/index-critical-ignore-bootstrap.html"
        );

        expect(output).to.equal(expected);
    });

    it("generates html with minified critical-path CSS for multiple dimensions successfully", () => {
        const expected = readFile("expected/index-dimensions.html");
        const output = readFile("generated/index-dimensions.html");

        expect(output).to.equal(expected);
    });

    it("generates html with extracted minified critical-path CSS successfully", () => {
        const expected = readFile("expected/index-extract.html");
        const output = readFile("generated/index-critical-extract.html");

        expect(output).to.equal(expected);
        expect(fileExists("fixture/styles/main.d41d8cd9.css")).to.equal(true);
        expect(fileExists("fixture/styles/bootstrap.130e6d81.css")).to.equal(
            true
        );
    });

    it('generates multiple html files without throwing "warning: possible EventEmitter memory leak detected"', () => {
        const expected = readFile("expected/index-multiple.html");
        let output;

        for (let i = 1; i <= 5; i++) {
            output = readFile(`generated/multiple/index${i}.html`);
            expect(output).to.equal(
                expected.replace(
                    "<title>page x</title>",
                    `<title>page ${i}</title>`
                )
            );
        }
    });

    it("generates multiple html files with minified CSS", () => {
        const expected = readFile("expected/index-multiple-minified.html");
        let output;

        for (let i = 1; i <= 5; i++) {
            output = readFile(`generated/multiple-min/index${i}.html`);
            expect(output).to.equal(
                expected.replace(
                    "<title>page x</title>",
                    `<title>page ${i}</title>`
                )
            );
        }
    });

    it("should keep external URLs with extract option", () => {
        const expected = readFile("expected/index-external.html");
        const output = readFile("generated/index-external.html");

        expect(output).to.equal(expected);
        expect(fileExists("fixture/styles/main.d41d8cd9.css")).to.equal(true);
        expect(fileExists("fixture/styles/bootstrap.ca3dbc40.css")).to.equal(
            true
        );
    });

    it("should write files to folder when folder is specified as dest", () => {
        const expected = readFile("expected/index-multiple.html");
        let output;

        for (let i = 1; i <= 5; i++) {
            expect(
                fileExists(`generated/multiple-files-folder/index${i}.html`)
            ).to.equal(true);
            output = readFile(`generated/multiple-files-folder/index${i}.html`);
            expect(output).to.equal(
                expected.replace(
                    "<title>page x</title>",
                    `<title>page ${i}</title>`
                )
            );
        }
    });

    it("should consider ignore option", () => {
        const expected = readFile("expected/critical-ignore.css");
        const output = readFile("generated/critical-ignore.css");

        expect(output).to.equal(expected);
    });

    it("should allow glob pattern for css option", () => {
        const expected = readFile("expected/critical.css");
        const output = readFile("generated/critical-glob.css");

        expect(output).to.equal(expected);
    });

    it("should allow remote sources", () => {
        const expectedCss = readFile("expected/critical.css");
        const expectedHtml = readFile("expected/index-minified.html");
        const outputCss = readFile("generated/remote.css");
        const outputHtml = readFile("generated/remote.html");

        expect(outputCss).to.equal(expectedCss);
        expect(outputHtml).to.equal(expectedHtml);
    });
});
