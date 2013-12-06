/*jshint node: true */
var assert = require('assert');
var safe = require('./safe');
var is = require('./is.js');


//creates a function with an additiona argument, error, if this is provided then the function will call back rather than run
module.exports = function (callback, f) {
  "use strict";
  is.function(callback);
  is.function(f);

  var that = function () {
    var error = arguments[0];
    if (typeof error !== 'undefined') {
      if (error !== null) {
        try
        {
          callback.apply(this, [error]);
        }
        catch(callbackError)
        {
          if(console)
          {
            console.error(callbackError);
          }
          throw callbackError;
        }
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