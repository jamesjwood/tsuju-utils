/*jshint node: true */
/*global $apply */

var assert = require('assert');
var log = require('./log.js');
var is = require('./is.js');

module.exports = function (callback, maybeAsync) {
  "use strict";
  is.function(callback, 'callback');
  is.function(maybeAsync, 'maybeAsync');


  var  errorDetectorCallback = function(error){
    if (error)
    {
      if(that.location)
      {
        if(!error.trace)
        {
          error.trace = [];
          var t = error.stack.split('\n')[1];
          error.trace.push(t);
          error.args = that.args;
        }
        error.trace.push(stack[2]);
      }
    }
    callback.apply(this, arguments);
  }
  
  var myArgs;
  var that = function () {
    myArgs = arguments;
    var newF = module.exports.catchSyncronousErrors(errorDetectorCallback, maybeAsync, stack);
    process.nextTick(function () {
        newF.apply(this, myArgs); 
    });
  };

  var stack = new Error().stack.split('\n');
  return that;
};


module.exports.alwaysAsync =module.exports;




module.exports.catchSyncronousErrors = function (callback, f, stack) {
  "use strict";
  assert.ok(callback, 'must provide a callbaack');
  assert.ok(f, 'must provide a f');

  var aName = f.name;

  var that = function () {
    try {
      f.apply(this, arguments);
    }
    catch (error) {
      var s = stack.splice(2, stack.length);
      error.trace = s;
      try
      {
        callback(error);      
      }
      catch(newE){
        newE.description = 'Could not call callback with error';
        newE.originalError = error;
        console.error(newE);
        throw newE;
      }
    }
  };
  return that;
};


module.exports.logCalls = function (f) {
  "use strict";
  var that = function () {
    var newArgs = argumentsToArray(arguments);
    var callback = newArgs.pop();
    var log = newArgs[newArgs.length - 1];
    assert.ok(callback, 'callback must be provided');
    var newCallback = function (error) {
      if (error) {
        log('ended with error');
      }
      else {
        log('end');
      }
      callback.apply(this, arguments);
    };
    newArgs.push(newCallback);
    log('start');
    return f.apply(this, newArgs);
  };
  return that;
};






module.exports.functionThatExitsIfPassedAnError = function (f) {
  "use strict";

  var that = function () {
    var error = arguments[0];
    var callback = arguments[arguments.length - 1];
    var log = arguments[arguments.length - 2];
    if (typeof error !== 'undefined') {
      if (error !== null) {
        log('passed an error, skipping');
        callback.apply(this, [error]);
        return;
      }
    }

    log('not passed an error, running');
    var newArgs = [];
    for (var i = 1; i < arguments.length; i++) {
      newArgs.push(arguments[i]);
    }
    f.apply(this, newArgs);
  };
  return that;
};




module.exports.addServiceFunction = function (f, service, name) {
  "use strict";
  var that = function () {
    var newArgs = argumentsToArray(arguments);
    var callback = newArgs.pop();
    assert.ok(callback, 'callback must be provided');
    var newCallback = function (error) {
      if (typeof error !== 'undefined') {
        service.emit('error', error);
      }
      callback.apply(this, arguments);
    };

    var myLog = function (message) {
      service.emit('log', message);
    };
    newCallback.log = log.addWrap(myLog).wrap(name);
    newArgs.push(newCallback);
    return f.apply(this, newArgs);
  };
  service[name] = that;
};

var argumentsToArray = function (oldArgs) {
  "use strict";
  var newArgs = [];
  for (var i = 0; i < oldArgs.length; i++) {
    newArgs.push(oldArgs[i]);
  }
  return newArgs;
};