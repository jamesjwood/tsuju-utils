/*jslint node: true */
/*global describe */
/*global it */
/*global test */
/*global setup */  
/*sloppy */  

var events = require('events');
var sinon = require('sinon');
var assert = require('assert');

var safe = require('../src/safe.js');
var log = require('../src/log.js');

describe('safe', function () {
  'use strict';
  var mainLog = function (message) {
    console.log('message: ' + message);
  };

  it('should execute the function', function (done) {
     var f = function(cb){
      cb();
    };
    safe(f)(function(error){
      done();
    });
  });

  it('should pass through arguments', function (done) {
    var f = function(message, cb){
      assert.equal("hello", message);
      cb();
    };
    safe(f)("hello",function(error){
      done();
    });
  });


 it('should catch errors', function (done) {
    var f = function(message, cb){
      throw new Error('my error');
    };
    safe(f)("hello",function(error){
      assert.ok(error);
      done();
    });
  });

  it('should pass back errors', function (done) {
    var f = function(message, cb){
      cb(new Error('my error'));
    };
    safe(f)("hello",function(error){
      assert.ok(error);
      done();
    });
  });


 
});