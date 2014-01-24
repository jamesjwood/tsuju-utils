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
        reporter: 'min'
      },
      all: { src: ['test.js'] }
    },
    browserify: {
      test: {
        files: {
          './stage/test.js': ['./test.js'],
        },
        options: {
          debug: true,
          ignore: ['domain', 'loggly', 'ga']
        },
      }
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

  grunt.registerTask('install', 'shell:buildStage');
  grunt.registerTask('test', ['jshint','simplemocha','browserify', 'karma']);
  grunt.registerTask('development',[]);
  grunt.registerTask('production', []);
};