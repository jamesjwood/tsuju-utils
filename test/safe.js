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
var loglib = require('../src/log.js');

describe('safe', function () {
  'use strict';
  var mainLog = loglib();
/*
  it('1: should execute the function', function (done) {
    var j = 0;
    var log = mainLog.wrap('1');

    var f = function (log, cb) {
      j = j + 1;
      cb();
    };
    var onDone = function(error){
      if(error)
      {
        log.error(error);
      }
      done(error);
    };
    safe(onDone, f)(mainLog.wrap('1'), function (error) {
      assert.ifError(error);
      assert.equal(1, j);
      onDone();
    });

  });

  it('2: should pass through arguments', function (done) {
    var j = 0;

    var log = mainLog.wrap('2');

    var f = function (message, log, cb) {
      assert.equal("hello", message);
       j = j + 1;
      cb();
    };

    var onDone = function(error){
      if(error)
      {
        log.error(error);
      }
      done(error);
    };
    safe(onDone, f)("hello", mainLog.wrap('2'), function (error) {
      assert.ifError(error);
      assert.equal(1, j);
      onDone();
    });
  });
*/
  it('3: should catch errors', function myFunctionName(done) {
    var log = mainLog.wrap('3');
    
    var onDone = function(error){
      assert.ok(error);
      if (e.stack)
      {
        var newStack = e.stack.split('\n');
        error.stacks.push(newStack);
        error.trace = error.trace.concat(newStack.slice(1, newStack.length));
      }
      assert.equal('my error', error.message);
      done();
    };

    var e = new Error();

    var myAsyncFunction = function(cbk){
      cbk();
    };

    myAsyncFunction(safe(onDone, function myFunctionName(error){
        if(error)
        {
          onDone(error);
          return;
        }
        myAsyncFunction(safe(onDone, function myFunctionName(error2){
          if(error2)
          {
            onDone(error2);
            return;
          }
          var e =  new Error('my error');
          throw e;
        }));
    }));  
  });


/*
  it('4: should pass back errors', function (done) {
    var f = function (message, log, cb) {
      cb(new Error('my error'));
    };
    safe(f)(undefined, "hello", mainLog.wrap('4'), function (error) {
      assert.ok(error);
      assert.equal('my error', error.message);
      done();
    });
  });

  it('5: should chain progress', function (done) {

    var myLog = mainLog.wrap('5');
    var asyncFunction = safe(function (args, log, then) {
        var result = syncFunction(args, 1, log.wrap("adding"));
        then(undefined, result);
    });

    var syncFunction = function(a, b, log){
      log('running');
      return a+b;
    };


    var onDone = function (error, result) {
      assert.equal(4, result);
      done();
    };

  
    asyncFunction(undefined, 1, myLog.wrap('first'), utils.safe(function(arg2){
        asyncFunction(error, arg1, myLog.wrap('second'), utils.safe(function(arg2){
           asyncFunction(er, arg2, myLog.wrap('third'), utils.safe(function(arg3, cb){
            cb();
          });
         }));
      })(err, onDone);
    );
  });*/
});