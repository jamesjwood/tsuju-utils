var assert = require('assert');
var log = require('./log.js');

module.exports = function(unsafe, service, name){
  "use strict";
  return serviceFunction(alwaysAsync(catchSyncronousErrors(addLogging(unsafe, name))), service);
};

var addLogging = function(f, name){
  "use strict";

  var that = function(){
    var newArgs = argumentsToArray(arguments);
    var callback = newArgs.pop();

    var newCallback = function(error){
      if(error)
      {
         newCallback.log("returning error");
      }
      callback.log(name);
      callback.apply(this, arguments);
    };

    newCallback.log = callback.log.wrap(name + ":");
    newArgs.push(newCallback);
    callback.log(name);
    return f.apply(this, newArgs);
  };
  return that;
};

var catchSyncronousErrors = function (unsafeFunction){
  "use strict";
    var that = function(){
      var callback = arguments[arguments.length-1];
      try
      {
        unsafeFunction.apply(this, arguments);
      }
      catch(error)
      {
        callback(error);
      }
    };
    return that;
  };


var alwaysAsync = function(maybeAsync){
  "use strict";
  var that = function(){
      var myArgs = arguments;
      process.nextTick(function(){
        maybeAsync.apply(this, myArgs);
      });
  };
  return that;
};


var serviceFunction = function(f, service){

  "use strict";
  var that;
  if(typeof service !== 'undefined')
  {
    that = function(){
      var newArgs = argumentsToArray(arguments);
      var callback = newArgs.pop();
      assert.ok(callback,'callback must be provided');
      var newCallback = function(error){
        if(error)
        {
          service.emit('error', error);
        }
        callback.apply(this, arguments);
      };

      var myLog = function(message){
        service.emit('log', message);
      };
      newCallback.log = log.addWrap(myLog);
      newArgs.push(newCallback);
      return f.apply(this, newArgs);
  };
  }
  else
  {
    that = f;
  }

  return that;
};

var argumentsToArray = function(oldArgs){
  "use strict";
      var newArgs = [];
      for(var i = 0 ; i < oldArgs.length; i ++)
      {
          newArgs.push(oldArgs[i]);
      } 
      return newArgs;
};
