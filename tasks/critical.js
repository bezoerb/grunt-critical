/*
 * Grunt-critical
 * https://github.com/bezoerb/grunt-critical
 *
 * Copyright (c) 2014 Ben Zörb
 * Licensed under the MIT license.
 */

'use strict';

const path = require('path');
const {eachSeries} = require('async');
const _ = require('lodash');
const glob = require('glob');

module.exports = (grunt) => {
  /**
   * Make sure a directory exists.
   * @param dir
   */
  function ensureDir(dir) {
    if (!grunt.file.isDir(dir)) {
      grunt.file.mkdir(dir);
    }
  }

  /**
   * Check whether a resource is external or not
   * @param href
   * @returns {boolean}
   */
  function isExternal(href) {
    return /(^\/\/)|(:\/\/)/.test(href);
  }

  grunt.registerMultiTask('critical', 'Extract & inline critical-path CSS from HTML', function () {
    const done = this.async();
    const options = this.options({
      // Your base directory
      base: '',
    });

    process.setMaxListeners(0);

    import('critical').then((critical) => {
      // Loop files array
      // Iterate over all specified file groups.
      eachSeries(
        this.files,
        (f, next) => {
          options.base = path.normalize(options.base || '');

          // Make filepath absolute
          const absoluteBase = `${path.resolve(options.base || './')}/`;

          // Concat specified files.
          let srcFiles = f.src.filter((filepath) => {
            // Warn on and remove invalid source files (if nonull was set).
            if (!grunt.file.exists(filepath) && !isExternal(filepath)) {
              grunt.log.warn(`Source file "${filepath}" not found.`);
              return false;
            }

            return true;
          });

          srcFiles = srcFiles.concat(f.orig.src.filter((filepath) => isExternal(filepath)));

          // nothing to do
          if (srcFiles.length === 0) {
              grunt.fail.warn('Destination (' + f.dest + ') not written because src files were empty.', [1]);
              return;
          }

          if (srcFiles.length > 1 && !grunt.file.isDir(f.dest)) {
              grunt.fail.warn('Destination needs to be a directory for multiple src files', [1]);
              return;
          }

          // Use glob for css option
          if (options.css) {
            if (!Array.isArray(options.css)) {
              options.css = [options.css];
            }

            options.css = _.chain(options.css)
              .compact()
              .map((css) =>
                glob.sync(css, {
                  nosort: true,
                })
              )
              .flatten()
              .value();
          }

          grunt.log.debug('SOURCE', srcFiles);
          grunt.log.debug('CSS', options.css);

          eachSeries(
            srcFiles,
            async (src) => {
              const inline = !/\.(css|scss|less|styl)/.test(path.extname(f.dest));
              const options_ = {inline, ...options};

              if (isExternal(src)) {
                options_.src = src;
              } else {
                options_.src = path.resolve(src).replace(absoluteBase, '');
              }

              let criticalPath = f.dest;

              if (grunt.file.isDir(f.dest)) {
                criticalPath = path.join(f.dest, options_.src);
              }

              grunt.log.debug('opts', options_);

              try {
                const {html, css, uncritical} = await critical.generate(options_);

                const output = inline ? html : css;
                const criticalDir = path.dirname(criticalPath);

                ensureDir(criticalDir);

                grunt.file.write(criticalPath, Buffer.from(output));
                // Print a success message.
                grunt.log.ok(`File "${criticalPath}" created.`);

                if (f.target?.uncritical) {
                  const uncriticalPath = f.target.uncritical;
                  const uncriticalDir = path.dirname(uncriticalPath);
                  ensureDir(uncriticalDir);
                  grunt.file.write(uncriticalPath, Buffer.from(uncritical));
                  grunt.log.ok(`Uncritical "${uncriticalPath}" created.`);
                }

                return output;
              } catch (error) {
                grunt.log.error(`File "${criticalPath}" failed.`, error.message || error);
                throw error;
              }
            },
            (error) => {
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
    });
  });
};
