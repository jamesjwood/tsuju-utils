/*jslint node: true */
/*global describe */
/*global it */
/*global test */
/*global setup */
/*global teardown */

var events = require('events');
var sinon = require('sinon');
var assert = require('assert');

var wl = require('../src/log.js');

describe('wl', function () {
  'use strict';
  var mainLog = function (message) {
    console.log('message: ' + message);
  };

  it('should create wrapped identical function', function (done) {

    var f = function (a, b) {
      this.log('adding');
      return a + b;
    };

    var logger = {
      log: function (message) {
        mainLog("1: " + message);
      }
    };

    var resul = wl(logger, "wl", f)(1, 2);
    assert.equal(3, resul);

    done();
  });


});