/*
 * grunt-critical
 * https://github.com/bezoerb/grunt-critical
 *
 * Copyright (c) 2014 Ben Zörb
 * Licensed under the MIT license.
 */

'use strict';

const path = require('path');
const critical = require('critical');
const async = require('async');
const _ = require('lodash');
const glob = require('glob');

module.exports = grunt => {
    /**
     * Check wether a resource is external or not
     * @param href
     * @returns {boolean}
     */
    function isExternal(href) {
        return /(^\/\/)|(:\/\/)/.test(href);
    }

    grunt.registerMultiTask(
        'critical',
        'Extract & inline critical-path CSS from HTML',
        function() {
            const done = this.async();
            const options = this.options({
                // Your base directory
                base: ''
            });

            process.setMaxListeners(0);

            // Loop files array
            // Iterate over all specified file groups.
            async.eachSeries(
                this.files,
                (f, next) => {
                    options.base = path.normalize(options.base || '');

                    // Make filepath absolute
                    const absoluteBase = `${path.resolve(
                        options.base || './'
                    )}/`;

                    // Concat specified files.
                    let srcFiles = f.src.filter(filepath => {
                        // Warn on and remove invalid source files (if nonull was set).
                        if (
                            !grunt.file.exists(filepath) &&
                            !isExternal(filepath)
                        ) {
                            grunt.log.warn(
                                `Source file "${filepath}" not found.`
                            );
                            return false;
                        }

                        return true;
                    });

                    srcFiles = srcFiles.concat(
                        f.orig.src.filter(filepath => {
                            return isExternal(filepath);
                        })
                    );

                    // nothing to do
                    if (srcFiles.length === 0) {
                        grunt.log.warn(
                            `Destination (${f.dest}) not written because src files were empty.`
                        );
                        return;
                    }

                    if (srcFiles.length > 1 && !grunt.file.isDir(f.dest)) {
                        grunt.log.warn(
                            'Destination needs to be a directory for multiple src files'
                        );
                        return;
                    }

                    // use glob for css option
                    if (options.css) {
                        if (!Array.isArray(options.css)) {
                            options.css = [options.css];
                        }

                        options.css = _.chain(options.css)
                            .compact()
                            .map(css => {
                                return glob.sync(css, {
                                    nosort: true
                                });
                            })
                            .flatten()
                            .value();
                    }

                    grunt.log.debug('SOURCE', srcFiles);
                    grunt.log.debug('CSS', options.css);

                    async.eachSeries(
                        srcFiles,
                        (src, cb) => {
                            const options_ = {
                                inline: !/\.(css|scss|less|styl)/.test(
                                    path.extname(f.dest)
                                ),
                                ...options
                            };

                            if (isExternal(src)) {
                                options_.src = src;
                            } else {
                                options_.src = path
                                    .resolve(src)
                                    .replace(absoluteBase, '');
                            }

                            let destination = f.dest;

                            if (grunt.file.isDir(f.dest)) {
                                destination = path.join(f.dest, options_.src);
                            }

                            grunt.log.debug('opts', options_);

                            critical
                                .generate(options_)
                                // eslint-disable-next-line promise/prefer-await-to-then
                                .then(output => {
                                    const dirname = path.dirname(destination);

                                    if (!grunt.file.isDir(dirname)) {
                                        grunt.file.mkdir(dirname);
                                    }

                                    grunt.file.write(destination, output);
                                    // Print a success message.
                                    grunt.log.ok(
                                        `File "${destination}" created.`
                                    );
                                    cb(null, output);
                                })
                                .catch(error => {
                                    grunt.log.error(
                                        `File "${destination}" failed.`,
                                        error.message || error
                                    );
                                    cb(error);
                                });
                        },
                        error => {
                            if (error) {
                                grunt.fail.warn(`File "${f.dest}" failed.`);
                                grunt.log.warn(error.message || error);
                            }

                            next();
                        }
                    );
                },
                done
            );
        }
    );
};
