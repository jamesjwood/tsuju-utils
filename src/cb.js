var log = require('./log.js');

module.exports = function () {
  "use strict";
  var callback;
  var innerFunction;
  var name;
  var myLog;

  if (arguments.length == 3) {
    name = arguments[0];
    callback = arguments[1];
    innerFunction = arguments[2];
  }
  else {
    if (arguments.length == 4) {
      name = arguments[0];
      callback = arguments[1];
      myLog = arguments[2];
      innerFunction = arguments[3];

    }
    else {
      callback = arguments[0];
      innerFunction = arguments[1];
    }
  }

  var nextTickCallback = function(){
    var myArgs = arguments;
    process.nextTick(function () {
      callback.apply(this, myArgs);
    });
  };
  
  nextTickCallback.log = callback.log;

  if (!callback) {
    throw new Error('callback was not passed');
  }
  if (typeof myLog === 'undefined') {
    myLog = callback.log;
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
      that.log('end');
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
  }
  if (typeof myLog === 'undefined') {
    that.log = log();
  }
  else {
    if (typeof myLog.wrap === 'undefined') {
      that.log = myLog;
    }
    else {
      that.log = myLog.wrap(name);
    }
  }

  that.log('start');
  return that;
};