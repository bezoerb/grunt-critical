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
    var fs = require('fs-extra');
    var _ = require('lodash');
    var glob = require('glob');

    /**
     * Check wether a resource is external or not
     * @param href
     * @returns {boolean}
     */
    function isExternal(href) {
        return /(^\/\/)|(:\/\/)/.test(href);
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
        async.eachSeries(this.files, function (f, next) {
            options.base = path.normalize(options.base || '');

            // absolutize filepath
            var basereplace = path.resolve(options.base || './') + '/';

            // Concat specified files.
            var srcFiles = f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath) && !isExternal(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });

            srcFiles = srcFiles.concat(f.orig.src.filter(function (filepath) {
                return isExternal(filepath);
            }));

            // nothing to do
            if (srcFiles.length === 0) {
                grunt.log.warn('Destination (' + f.dest + ') not written because src files were empty.');
                return;
            }

            if (srcFiles.length > 1 && !grunt.file.isDir(f.dest)) {
                grunt.log.warn('Destination needs to be a directory for multiple src files');
                return;
            }

            // use glob for css option
            if (options.css) {
                if (!_.isArray(options.css)) {
                    options.css = [options.css];
                }

                options.css = _.chain(options.css)
                    .compact()
                    .map(function(css) {
                        return glob.sync(css, {
                            nosort: true
                        });
                    })
                    .flatten()
                    .value();
            }

            grunt.log.debug('SOURCE', srcFiles);

            grunt.log.debug('CSS', options.css);

            async.eachSeries(srcFiles, function (src, cb) {
                var opts = _.assign({
                    inline: !/\.(css|scss|less|styl)/.test(path.extname(f.dest))
                }, options);

                if (!isExternal(src)) {
                    opts.src = path.resolve(src).replace(basereplace, '');
                } else {
                    opts.src = src;
                }

                var destination = f.dest;
                if (grunt.file.isDir(f.dest)) {
                    destination = path.join(f.dest, opts.src);
                }
                grunt.log.debug('opts', opts);


                critical.generate(opts).then(function (output) {
                    fs.outputFileSync(destination, output);
                    // Print a success message.
                    grunt.log.ok('File "' + destination + '" created.');

                    cb(null, output);
                }).error(function (err) {
                    grunt.log.error('File "' + destination + '" failed.', err.message || err);
                    cb(err);
                });

            }, function (e) {
                if (e) {
                    grunt.fail.warn('File "' + f.dest + '" failed.');
                    grunt.log.warn(e.message || e);

                }
                next();
            });
        }, done);
    });

};
