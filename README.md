# grunt-critical

Grunt plugin to extract & inline critical-path CSS from HTML

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Build Status: Windows][appveyor-image]][appveyor-url]
[![Dependency Status][depstat-image]][depstat-url]

## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-critical --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-critical');
```

## Critical task

_Run this task with the `grunt critical` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

Generate critical path css and inline it with [critical](https://github.com/addyosmani/critical).

### Usage

Use the `grunt-critical` task by specifying a target destination (file) for your critical CSS. Below this is `test/generated/critical.css`.

Along-side, specify the input HTML file you would like scanned as well as the width and height of the critical viewport.
In this case `test/fixture/index.html`.

```js
critical: {
    test: {
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
    }
}
```

If the `dest` file is a stylesheet, the resulting critical-path css is saved to this file for later use.
If `dest` points to an Markup file (HTML, PHP, etc.) the resulting CSS gets inlined and the exiting stylesheets are
wrapped in a javascript function to load them asynchronously as well as a `noscript` block for users with JavaScript disabled

```js
critical: {
    test: {
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
        dest: 'test/generated/index-critical.html'
    }
}
```

## Options

For a full list of options see [critical](https://github.com/addyosmani/critical#options)

## License

(C) Ben Zörb 2014, released under an MIT license


[npm-url]: https://npmjs.org/package/grunt-critical
[npm-image]: https://badge.fury.io/js/grunt-critical.svg

[travis-url]: https://travis-ci.org/bezoerb/grunt-critical
[travis-image]: https://travis-ci.org/bezoerb/grunt-critical.svg?branch=master

[depstat-url]: https://david-dm.org/bezoerb/grunt-critical
[depstat-image]: https://david-dm.org/bezoerb/grunt-critical.svg

[appveyor-url]: https://ci.appveyor.com/project/bezoerb/grunt-critical/branch/master
[appveyor-image]: https://ci.appveyor.com/api/projects/status/pnhd2gljrg9xea26/branch/master?svg=true
