
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