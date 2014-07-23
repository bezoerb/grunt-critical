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
            options: {

            },
            test: {
                src: 'test/fixture/index.html',
                dest: 'test/generated/critical.css',
                width: 320,
                height: 480
            }
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');


    grunt.registerTask('test', ['complexity', 'jshint', 'simplemocha', 'watch']);
    grunt.registerTask('ci', ['complexity', 'jshint', 'simplemocha']);
    grunt.registerTask('default', ['test']);
};
