# grunt-critical

Grunt plugin to extract & inline critical-path CSS from HTML (WiP alpha version)

[![build status](https://secure.travis-ci.org/bezoerb/grunt-critical.png)](http://travis-ci.org/bezoerb/grunt-critical)

## Getting Started

This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-critical --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-critical');


## Critical task

_Run this task with the `grunt critical` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

Generate critical path css and inline it with  [critical](https://github.com/addyosmani/critical).

### Usage

Use the `grunt-critical` task by specifying a target destination (file) for your critical CSS. Below this is `test/generated/critical.css`.

Along-side, specify the input HTML file you would like scanned as well as the width and height of the critical viewport.
In this case `test/fixture/index.html`.

```shell
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

## Options

Sample use of all supported options:
```shell
TODO
```

## License

(C) Ben Zörb 2014, released under an MIT license