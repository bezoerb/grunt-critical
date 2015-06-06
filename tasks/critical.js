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
    var extend = require('util')._extend;
    var fs = require('fs-extra');


    function isDir(p) {
        return typeof p === 'string' && (grunt.file.isDir(p) || /\/$/.test(p));
    }

    grunt.registerMultiTask('critical', 'Extract & inline critical-path CSS from HTML', function () {

        var done = this.async();
        var options = this.options({
            // Your base directory
            base: ''
        });

        process.setMaxListeners(0);

        // Loop files array
        // Iterate over all specified file groups.
        async.eachSeries(this.files,function(f,next) {
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

            if (srcFiles.length > 1 && !isDir(f.dest)) {
                grunt.log.warn('Destination needs to be a directory for multiple src files');
                return;
            }

            // choose wether to create raw css or complete html
            var command = (/\.(css|scss|less|styl)/.test(path.extname(f.dest))) ? 'generate' : 'generateInline';

            async.eachSeries(srcFiles,function(src,cb){
                var opts = extend({},options);
                opts.src = path.resolve(src).replace(basereplace,'');

                var destination = f.dest;
                if (isDir(f.dest)) {
                    destination = path.join(f.dest, opts.src);
                }

                try {
                    critical[command](opts, function (err, output){
                        if (err) {
                            return cb(err);
                        }
                        fs.outputFileSync(destination, output);
                        // Print a success message.
                        grunt.log.ok('File "' + destination + '" created.');

                        cb(null,output);
                    });
                } catch (err) {
                    cb(err);
                }
            },function(e) {
                if (e) {
                    grunt.fail.warn('File "' + f.dest + '" failed.');
                    grunt.log.warn(e.message || e);

                }
                next();
            });
        },done);
    });

};
