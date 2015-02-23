// Generated on 2014-07-23 using generator-nodejs 2.0.1
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        complexity: {
            generic: {
                src: ['app/**/*.js'],
                options: {
                    errorsOnly: false,
                    cyclometric: 6,       // default is 3
                    halstead: 16,         // default is 8
                    maintainability: 100  // default is 100
                }
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'app/**/*.js',
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
                    width: 320,
                    height: 70
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
                    width: 320,
                    height: 70
                },
                src: 'test/fixture/index.html',
                dest: 'test/generated/index-critical.html'
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
                    width: 320,
                    height: 70
                },
                src: 'test/fixture/index.html',
                dest: 'test/generated/index-critical-extract.html'
            },
            'test-multiple': {
                options: {
                    minify: true,
                    base: 'test/fixture',
                    css: [
                        'test/fixture/styles/main.css',
                        'test/fixture/styles/bootstrap.css'
                    ],
                    width: 320,
                    height: 70
                },
                files: [
                    // makes all src relative to cwd
                    {expand: true, cwd: 'test/fixture/', src: ['multiple/**/*.html'], dest: 'test/generated/'}
                ]
            },
            'issue-8': {
                options: {
                    base: 'test/fixture/issue-8',
                    css: [
                        'test/fixture/issue-8/styles/test_require.css',
                    ],
                    minify: true,
                    width: 100,
                    height: 50
                },
                src: 'test/fixture/issue-8/test_require.html',
                dest: 'test/generated/issue-8/test_require.css'
            }
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');


    grunt.registerTask('test', ['complexity', 'jshint', 'critical', 'simplemocha', 'watch']);
    grunt.registerTask('ci', ['complexity', 'jshint', 'critical', 'simplemocha']);
    grunt.registerTask('default', ['test']);
};
