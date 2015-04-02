// Generated on 2014-07-23 using generator-nodejs 2.0.1
module.exports = function (grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        complexity: {
            generic: {
                src: ['tasks/critical.js'],
                options: {
                    errorsOnly: false,
                    cyclometric: 3,       // default is 3
                    halstead: 8,         // default is 8
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
            'test-dimensions': {
                options: {
                    minify: true,
                    base: './',
                    css: [
                        'test/fixture/styles/main.css',
                        'test/fixture/styles/bootstrap.css'
                    ],
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
                files: [
                    // makes all src relative to cwd
                    {expand: true, cwd: 'test/fixture/', src: ['multiple/**/*.html'], dest: 'test/generated/'}
                ]
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
            }
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');


    grunt.registerTask('test', ['complexity', 'jshint', 'critical', 'simplemocha', 'watch']);
    grunt.registerTask('ci', ['complexity', 'jshint', 'critical', 'simplemocha']);
    grunt.registerTask('default', ['test']);
};
