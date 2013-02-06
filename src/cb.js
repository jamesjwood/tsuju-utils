var log = require('./log.js');

module.exports = function () {
  "use strict";
  var callback;
  var innerFunction;
  var name;
  if (arguments.length == 3) {
    name = arguments[0];
    callback = arguments[1];
    innerFunction = arguments[2];
  }
  else {
    callback = arguments[0];
    innerFunction = arguments[1];
  }

  if (!callback) {
    throw new Error('callback was not passed');
  }
  var that = function () {
    var newArgs = [];
    try {
      var error = arguments[0];
      if (error) {
        //callback(error);
        process.nextTick(function () {
          callback(error);
        });
        return;
      }

      for (var i = 1; i < arguments.length; i++) {
        newArgs.push(arguments[i]);
      }

    }
    catch (er) {
      //var newError = new Error("Error at listrbro.cb");
      //newError.innerException  = er;
      if (callback) {
        //callback(er);
        process.nextTick(function () {
          callback(er);
        });
        return;
      }
      else {
        throw er;
      }
    }
    try {
      that.log('end');
      innerFunction.apply(this, newArgs);
    }
    catch (er2) {
      //callback(er2);
      process.nextTick(function () {
        callback(er2);
      });
    }
  };
  if (callback.task) {
    that.task = callback.task;
  }
  if(typeof callback.log !== 'undefined')
  {
    if(typeof callback.log.wrap !== 'undefined')
    {
        that.log = callback.log.wrap(name);
    }
    else
    {
      that.log = callback.log;
    }
    
  }
  else
  {
    that.log = function(){};
  }

  that.log('start');
  return that;
};