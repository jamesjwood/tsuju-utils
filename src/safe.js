/*global $apply */

var assert = require('assert');
var log = require('./log.js');

module.exports = function (callback, r) {
  "use strict";
  return module.exports.alwaysAsync(callback, r);
};

module.exports.catchSyncronousErrors = function (callback, f) {
  "use strict";
  assert.ok(callback);
  assert.ok(f);

  var that = function () {
    try {
      f.apply(this, arguments);
    }
    catch (error) {
      callback(error);
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




module.exports.alwaysAsync = function (callback, maybeAsync) {
  "use strict";

  assert.ok(callback);
  assert.ok(maybeAsync);

  var that = function () {
    var myArgs = arguments;
    var newF = module.exports.catchSyncronousErrors(callback, maybeAsync);
    process.nextTick(function () {
        newF.apply(this, myArgs); 
    });
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