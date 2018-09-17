'use strict';

var finalhandler = require('finalhandler');
var http = require('http');
var serveStatic = require('serve-static');

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        complexity: {
            generic: {
                src: ['tasks/critical.js'],
                options: {
                    errorsOnly: false,
                    cyclometric: 3,       // default is 3
                    halstead: 8,          // default is 8
                    maintainability: 100  // default is 100
                }
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/**/*.js',
                'test/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        simplemocha: {
            all: ['test/**/*.js'],
            options: {
                reporter: 'spec',
                ui: 'bdd'
            }
        },
        watch: {
            js: {
                files: ['**/*.js', '!node_modules/**/*.js'],
                tasks: ['default'],
                options: {
                    nospawn: true
                }
            }
        },
        critical: {
            'test-css': {
                options: {
                    base: './',
                    css: [
                        'test/fixture/styles/main.css',
                        'test/fixture/styles/bootstrap.css'
                    ],
                    width: 1300,
                    height: 900
                },
                src: 'test/fixture/index.html',
                dest: 'test/generated/critical.css'
            },
            'test-css-glob': {
                options: {
                    base: './',
                    css: [
                        'test/fixture/styles/{main,bootstrap}.css'
                    ],
                    width: 1300,
                    height: 900
                },
                src: 'test/fixture/index.html',
                dest: 'test/generated/critical-glob.css'
            },
            'test-ignore': {
                options: {
                    base: './',
                    css: [
                        'test/fixture/styles/main.css',
                        'test/fixture/styles/bootstrap.css'
                    ],
                    width: 1300,
                    height: 900,
                    ignore: ['@media', /jumbotron/]
                },
                src: 'test/fixture/index.html',
                dest: 'test/generated/critical-ignore.css'
            },
            'test-html': {
                options: {
                    minify: true,
                    base: './',
                    css: [
                        'test/fixture/styles/main.css',
                        'test/fixture/styles/bootstrap.css'
                    ],
                    width: 1300,
                    height: 900
                },
                src: 'test/fixture/index.html',
                dest: 'test/generated/index-critical.html'
            },
            'test-html-ignore-inline': {
                options: {
                    minify: true,
                    base: './',
                    css: [
                        'test/fixture/styles/main.css',
                        'test/fixture/styles/bootstrap.css'
                    ],
                    inline: {
                        ignore: [/bootstrap\.css/],
                    },
                    width: 1300,
                    height: 900
                },
                src: 'test/fixture/index.html',
                dest: 'test/generated/index-critical-ignore-bootstrap.html'
            },
            'test-dimensions': {
                options: {
                    minify: true,
                    base: 'test/fixture',
                    dimensions: [
                        {
                            width: 1300,
                            height: 900
                        },
                        {
                            width: 500,
                            height: 900
                        }

                    ]
                },
                src: 'test/fixture/index.html',
                dest: 'test/generated/index-dimensions.html'
            },
            'test-extract': {
                options: {
                    minify: true,
                    extract: true,
                    base: 'test/fixture',
                    css: [
                        'test/fixture/styles/main.css',
                        'test/fixture/styles/bootstrap.css'
                    ],
                    width: 1300,
                    height: 900
                },
                src: 'test/fixture/index.html',
                dest: 'test/generated/index-critical-extract.html'
            },
            'test-multiple': {
                options: {
                    base: 'test/fixture',
                    css: [
                        'test/fixture/styles/main.css',
                        'test/fixture/styles/bootstrap.css'
                    ],
                    width: 1300,
                    height: 900
                },
                // makes all src relative to cwd
                files: [{
                    expand: true,
                    cwd: 'test/fixture/',
                    src: ['multiple/**/*.html'],
                    dest: 'test/generated/'
                }]
            },
            'test-multiple-minified': {
                options: {
                    base: 'test/fixture',
                    minify: true,
                    css: [
                        'test/fixture/styles/main.css',
                        'test/fixture/styles/bootstrap.css'
                    ],
                    width: 1300,
                    height: 900
                },
                // makes all src relative to cwd
                files: [{
                    expand: true,
                    cwd: 'test/fixture/multiple',
                    src: ['**/*.html'],
                    dest: 'test/generated/multiple-min'
                }]
            },
            'test-external': {
                options: {
                    base: 'test/fixture',
                    minify: true,
                    extract: true,
                    css: [
                        'test/fixture/styles/main.css',
                        'test/fixture/styles/bootstrap.css'
                    ],
                    width: 1300,
                    height: 900
                },
                src: 'test/fixture/index-external.html',
                dest: 'test/generated/index-external.html'
            },
            'test-multiple-files-folder': {
                options: {
                    base: 'test/fixture',
                    css: [
                        'test/fixture/styles/main.css',
                        'test/fixture/styles/bootstrap.css'
                    ],
                    width: 1300,
                    height: 900
                },
                files: [{
                    expand: true,
                    cwd: 'test/fixture/multiple',
                    src: ['**/*.html'],
                    dest: 'test/generated/multiple-files-folder'
                }]
            },
            'test-remote-css': {
                options: {
                    base: './',
                    css: 'test/fixture/styles/{main,bootstrap}.css',
                    width: 1300,
                    height: 900
                },
                src: 'http://localhost:3000/index.html',
                dest: 'test/generated/remote.css'

            },
            'test-remote-html': {
                options: {
                    minify: true,
                    base: './',
                    css: [
                        'test/fixture/styles/main.css',
                        'test/fixture/styles/bootstrap.css'
                    ],
                    width: 1300,
                    height: 900
                },
                src: 'http://localhost:3000/index.html',
                dest: 'test/generated/remote.html'
            }
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    var server;
    grunt.registerTask('startServer', function () {
        var serve = serveStatic('test/fixture', {
            index: ['index.html', 'index.htm']
        });

        server = http.createServer(function (req, res) {
            var done = finalhandler(req, res);
            serve(req, res, done);
        });
        server.listen(3000);
    });

    grunt.registerTask('stopServer', function () {
        server.close();
    });


    grunt.registerTask('test', ['jshint', 'startServer', 'critical', 'stopServer', 'simplemocha', 'watch']);
    grunt.registerTask('ci', ['jshint', 'startServer', 'critical', 'stopServer', 'simplemocha']);
    grunt.registerTask('default', ['test']);
};
