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
    var async = require('async')

    grunt.registerMultiTask('critical', 'Extract & inline critical-path CSS from HTML', function () {

        var done = this.async();
        var options = this.options({
            // Your base directory
            base: ''
        });

        // Loop files array
        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
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


            if (srcFiles.length === 0) {
                grunt.log.warn('Destination (' + f.dest + ') not written because src files were empty.');
                return;
            }


            var command = (/\.(css|scss|less)/.test(path.extname(f.dest))) ? 'generate' : 'generateInline';

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
                    console.log(e);
                    var err = new Error('Critical failed.');
                    if (e.msg) {
                        err.message += ', ' + e.msg + '.';
                    }
                    err.origError = e;
                    grunt.log.warn('Generating critical-path css failed.');
                    grunt.fail.warn(err);
                }
                done();
            });
        });

    });

};
