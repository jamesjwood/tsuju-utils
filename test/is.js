/*jslint node: true */
/*global describe */
/*global it */
/*global test */
/*global setup */
/*global teardown */

var assert = require('assert');

var lib = require('../src/is.js');

var log = require('../src/log.js');

describe('f', function () {
  'use strict';
  var masterLog = log().wrap('is');

  it('1: should detect object', function () {
    var myLog = masterLog.wrap('1');

    lib.object({});

    assert.throws(function(){
      lib.object(2);
    });
    
    assert.throws(function(){
      lib.object(null);
    });
  });

  it('2: should detect function', function () {
    var myLog = masterLog.wrap('2');

    lib.function(function(){});

    assert.throws(function(){
      lib.function({});
    });
    
    assert.throws(function(){
      lib.function(null);
    });
  });
  it('3: should detect string', function () {
    var myLog = masterLog.wrap('2');

    lib.string("23ewr23");

    assert.throws(function(){
      lib.string({});
    });
    
    assert.throws(function(){
      lib.string(null);
    });
  });
  it('4: should detect number', function () {
    var myLog = masterLog.wrap('2');

    lib.number(2323);

    assert.throws(function(){
      lib.number({});
    });
    
    assert.throws(function(){
      lib.number(null);
    });
  });
});