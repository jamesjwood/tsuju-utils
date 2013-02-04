/*jslint node: true */
/*global describe */
/*global it */
/*global test */
/*global setup */
/*global teardown */

var events = require('events');
var sinon = require('sinon');
var assert = require('assert');

var uuid = require('../src/uuid.js');

describe('uuid', function () {
  'use strict';
  var mainLog = function (message) {
    console.log('message: ' + message);
  };

  it('should create a uuid with length 36', function (done) {
    var id = uuid();
    assert.ok(id);
    assert.equal(36, id.length);

    var arr = id.split("-");
    assert.equal(5, arr.length);
    assert.equal(8, arr[0].length);
    assert.equal(4, arr[1].length);
    assert.equal(4, arr[2].length);
    assert.equal(4, arr[3].length);
    assert.equal(12, arr[4].length);
    done();
  });
  it('should create be different', function (done) {
    var id = uuid();
    var id2 = uuid();
    assert.notEqual(id, id2);
    done();
  });
});