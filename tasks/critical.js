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
            base: ''
        });

        // Loop files array
        grunt.util.async.forEachSeries(this.files, function(f, nextFileObj) {
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

            options.base = path.normalize(options.base || '');


            // absolutize filepath
            var basereplace = path.resolve(options.base || './') + '/';



            grunt.util.async.concatSeries(src, function(file, next) {
                try {

                    options.src = path.resolve(file).replace(basereplace,'');
//                    options.dest = path.resolve(f.dest).replace(basereplace,'');

                    critical.generate(options, function (err, output){
                        if (err) {
                            throw err;
                        }
                        grunt.file.write(f.dest, output);
                        next();
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
            }, function() {
                grunt.log.debug('done');
                nextFileObj();
            });


        },done);

    });

};
