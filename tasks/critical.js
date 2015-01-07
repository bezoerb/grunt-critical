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
    var async = require('async');

    grunt.registerMultiTask('critical', 'Extract & inline critical-path CSS from HTML', function () {

        var done = this.async();
        var options = this.options({
            // Your base directory
            base: ''
        });

        // count files to eventualy increase max listeners to prevent EventEmitter memory leak warning
        var numfiles = this.files.reduce(function(res,f) {
            res = res.concat(f.src.filter(function(filepath) {
                return grunt.file.exists(filepath);
            }));
            return res;
        },[]).length;

        if (numfiles > 10) {
            grunt.verbose.ok('Increasing maxListeners to ' + numfiles);
            // quick hack to prevent event stacking in tests
            process.setMaxListeners(numfiles +3);
        }

        // Loop files array
        // Iterate over all specified file groups.
        async.each(this.files,function(f,next) {
            options.base = path.normalize(options.base || '');

            // absolutize filepath
            var basereplace = path.resolve(options.base || './') + '/';

            // Concat specified files.
            var srcFiles = f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });

            // nothing to do
            if (srcFiles.length === 0) {
                grunt.log.warn('Destination (' + f.dest + ') not written because src files were empty.');
                return;
            }

            // choose wether to create raw css or complete html
            var command = (/\.(css|scss|less|styl)/.test(path.extname(f.dest))) ? 'generate' : 'generateInline';

            async.each(srcFiles,function(src,cb){
                options.src = path.resolve(src).replace(basereplace,'');
                try {
                    critical[command](options, function (err, output){
                        if (err) {
                            cb(err);
                        }
                        grunt.file.write(f.dest, output);
                        // Print a success message.
                        grunt.log.writeln('File "' + f.dest + '" created.');

                        cb(null,output);
                    });
                } catch (err) {
                    cb(err);
                }
            },function(e) {
                if (e) {
                    grunt.log.warn('Destination (' + f.dest + ') failed. ' + e.msg);
                }
                next();
            });
        },done);
    });

};
