
var assert = require('assert');
var safe = require('./safe');


//creates a function with an additiona argument, error, if this is provided then the function will call back rather than run
module.exports = function (callback, f) {
  "use strict";
  assert.ok(callback, 'must provide a callback');
  assert.ok(f, 'must provide a function');
  var that = function () {
    var error = arguments[0];
    if (typeof error !== 'undefined') {
      if (error !== null) {
        callback.apply(this, [error]);
        return;
      }
    }
    var newArgs = [];
    for (var i = 1; i < arguments.length; i++) {
      newArgs.push(arguments[i]);
    }
    //create a function that will catch all errors
    var safeF = safe(callback, f);
    safeF.apply(this, newArgs);
  };
  return that;
};

/*
module.exports.cbOld = function (callback, innerFunction) {
  "use strict";
  assert.ok(callback);
  assert.ok(innerFunction);

  

  var nextTickCallback = function () {
    var myArgs = arguments;
    process.nextTick(function () {
      callback.apply(this, myArgs);
    });
  };


  if (!callback) {
    throw new Error('callback was not passed');
  }

  var that = function () {
    var newArgs = [];
    try {
      var error = arguments[0];
      if (error) {
        callback(error);
        return;
      }

      for (var i = 1; i < arguments.length; i++) {
        newArgs.push(arguments[i]);
      }
      //newArgs.push(callback);
    }
    catch (er) {
      //var newError = new Error("Error at listrbro.cb");
      //newError.innerException  = er;
      if (callback) {
        callback(er);
        return;
      }
      else {
        throw er;
      }
    }
    try {
      //process.nextTick(function () {
      innerFunction.apply(this, newArgs);
      //});
    }
    catch (er2) {
      callback(er2);
    }
  };
  if (callback.task) {
    that.task = callback.task;
  };
  return that;
};
*/