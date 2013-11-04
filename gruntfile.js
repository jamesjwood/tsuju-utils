


module.exports = function(grunt) {
  "use strict";
  // Project configuration.
  grunt.initConfig({
    watch: {
      options: {
        interrupt: true,
        files: ['src/*.js', 'test/*.js'],
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


grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-shell');
grunt.loadNpmTasks('grunt-simple-mocha');

grunt.loadNpmTasks('grunt-karma');

grunt.registerTask('test', ['default','simplemocha', 'shell:buildStage','shell:browserify', 'karma']);
grunt.registerTask('default', ['jshint']);
};