/*
 * grunt-critical
 * https://github.com/bezoerb/grunt-critical
 *
 * Copyright (c) 2014 Ben Zörb
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    var critical = require('critical');
    var path = require('path');

    grunt.registerMultiTask('critical', 'Extract & inline critical-path CSS from HTML', function () {

        var done = this.async();
        var options = this.options({
            // Your base directory
            base: process.cwd(),

            // Viewport width
            width: 1024,

            // Viewport height
            height: 768,

            // Target for final HTML output
            htmlTarget: '',

            // Target for generated critical-path CSS (which we inline)
            styleTarget: '',

            // Minify critical-path CSS when inlining
            minify: true
        });

        this.files.forEach(function (f) {
            var src = f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });

            if (src.length === 0) {
                grunt.log.warn('Destination (' + f.dest + ') not written because src files were empty.');
                return;
            }

            try {
                options.src = src;
                options.dest = f.dest;

                critical.generateInline(options, function (err, output){
                    done();
                });

            } catch (e) {
                var err = new Error('Critical failed.');
                if (e.msg) {
                    err.message += ', ' + e.msg + '.';
                }
                err.origError = e;
                grunt.log.warn('Generating critical path for source "' + src + '" failed.');
                grunt.fail.warn(err);
            }
        });

    });

};
