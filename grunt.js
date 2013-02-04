

module.exports = function (grunt) {
  'use strict';
  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    beautify: {
      tests: 'test/*.js',
      files: ['src/**/*.js', 'test/**/*.js', 'index.js']
    },
    lint: {
      all: ['grunt.js', 'src/**/*.js',  'test/**/*.js', 'index.js']
    },
    jshint: {
      options: {
        browser: true,
        node: true
      }
    },
    watch: {
      files: ['grunt.js', 'src/**/*.js',  'test/**/*.js', 'index.js'],
      tasks: 'default'
    },
     browserify: {
      "stage/unitTests.js": {
            ignore: ['domain'  ,'loggly' , 'pouchdb'],
            entries: ['test/*.js']
      }
    },
    simplemocha: {
      unit: {
        src: ['test/**/*.js'],
        options: {
          reporter: 'spec',
          timeout: 5000,
          ignoreLeaks: true
        }
      }
    },
    testacular: {
      unit: {
        configFile: 'testacular.conf.js',
        singleRun: true,
        browsers: ['Chrome']
      }
    },
    'cors-server': {
      base: 'http://127.0.0.1:5984',
      port: 2020
    }
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-beautify');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('gruntacular');

  // Default task.



  grunt.registerTask('default', 'lint browserify simplemocha:unit testacular');
  grunt.registerTask('nodeonly', 'lint browserify simplemocha:unit');
  grunt.registerTask('tidy', 'beautify');
};