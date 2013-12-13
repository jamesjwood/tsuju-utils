/*jslint node: true */
/*global describe */
/*global it */
/*global test */
/*global setup */
/*global teardown */

var events = require('events');
var sinon = require('sinon');
var assert = require('assert');

var lib = require('../src/f.js');

var cb = require('../src/cb.js');
var safe = require('../src/safe.js');
var log = require('../src/log.js');

describe('f', function () {
  'use strict';
  var masterLog = log().wrap('f');

  it('1: should call a function with args', function (done) {
    var myLog = masterLog.wrap('1');

    var onDone = function(error){
      if(error)
      {
        myLog(error);
      }
      done(error);
    };

    var newF = lib(function functionName2(a, b, cbk){
      cbk(null, a + b);
    });

    newF(1, 2, cb(onDone, function(result){
      assert.equal(3, result);
      onDone();
    }));
  });

  it('2: should catch syncronous errors', function (done) {
    var myLog = masterLog.wrap('2');

    var onDone = function(error){
      if(error)
      {
        myLog(error);
      }
      done(error);
    };

    var newF = lib(function functionName2(a, b, cbk){
      throw new Error('myError');
    });

    newF(1, 2, safe(onDone, function(error, result){
      assert.ok(error);
      assert.equal(error.message, 'myError');
      onDone();
    }));
  });
});