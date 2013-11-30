var getWatchers = require('getWatchers');
var pkg = require('./package.json');


module.exports = function(grunt) {
  "use strict";
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bumpup: {
        options: {
            updateProps: {
                pkg: 'package.json'
            }
        },
        file: 'package.json'
    },
     watch: {
      local: {
        options: {
          debounceDelay: 5000,
          interrupt: true
        },
        files: ['*.js','src/**/*.js', 'test/**/*.js'],
        tasks: ['default']
      }
    },
    jshint: {
      options: {
        browser: true,
        node: true
      },
      all: ['src/*.js', 'test/*.js']
    },
    simplemocha: {
      options: {
        ui: 'bdd',
        reporter: 'tap'
      },
      all: { src: ['test.js'] }
    },
    shell: {
      browserify:{
        command: 'node ./node_modules/browserify/bin/cmd.js --debug -o ./stage/test.js -i domain -i loggly -i ga -i pouchdb  -i "./test.js" -e ./test.js;',
        stdout: true,
        stderr: true,
        failOnError: true
      },
      buildStage:{
        command: 'rm -rf stage; mkdir stage;cp -av web/ stage; rm -rf bin; mkdir bin;',
        stdout: true,
        stderr: true,
        failOnError: true
      }
    },
    karma: {
      local: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['Safari']
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


  grunt.registerTask('test', ['jshint','simplemocha', 'shell:buildStage','shell:browserify', 'karma']);
  grunt.registerTask('development', ['bumpup:prerelease']);
  grunt.registerTask('production', ['bump:patch']);
};