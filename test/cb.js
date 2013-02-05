/*jslint node: true */
/*global describe */
/*global it */
/*global test */
/*global setup */
/*global teardown */

var events = require('events');
var sinon = require('sinon');
var assert = require('assert');

var cb = require('../src/cb.js');

describe('cb', function () {
  'use strict';
  var mainLog = function (message) {
    console.log('message: ' + message);
  };

  it('should create callback function that wraps the given function', function (done) {
    var functionToBeWrapped = function (a, b, cb) {
      cb(null, a + b);
    };

    var onFinish = function (error) {

    };
    onFinish.log = function () {};


    var wrapped = cb(onFinish, functionToBeWrapped);

    wrapped.apply(this, [null, 1, 2, function (result) {
      console.dir(result);
      done();
    }]);
  });

  it('should pass through logs', function (done) {
    var functionToBeWrapped = function (a, b, cb) {
      cb(null, a + b);
    };

    var onFinish = function (error) {

    };
    onFinish.log = function (message) {
      if (message === 'test: done') {
        done();
      }
    };
    var wrapped = cb('test', onFinish, functionToBeWrapped);
    wrapped.log('done');
  });

  it('should catch errors and pass them back', function (done) {
    var functionToBeWrapped = function (a, b, cb) {
      throw new Error('error to catch');
    };

    var onFinish = function (error) {
      assert.ok(error);
      assert.equal('error to catch', error.message);
      done();
    };
    onFinish.log = function (message) {};

    var wrapped = cb('test', onFinish, functionToBeWrapped);
    wrapped.apply(this, [null, 1, 2, function (result) {
      throw new Error('should not get here');
    }]);
  });


});