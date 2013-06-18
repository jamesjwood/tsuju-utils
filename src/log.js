'use strict';
var red, blue, reset;
red   = '\u001b[31m';
blue  = '\u001b[34m';
reset = '\u001b[0m';

module.exports = function () {
  "use strict";

  var logFunction;
  var emitter;
  if (arguments.length === 1) {
     emitter = arguments[0];
     logFunction = function(message, path){
        emitter.emit('log', message, path);
     };
  }
  else {
    logFunction = function (message, path) {
      if(console && path)
      {
        console.log(path + ":: " + message);
      }
      else
      {
        console.log(message);
      }
    };
  }
  if(logFunction)
  {
     logFunction.log = function(message, path){
      logFunction(message, path);
    };
    logFunction.error = function(error, path){
      if(console.error)
      {
        console.error(error, path);
        return
      }
      logFunction.log(red + error.message + reset, path);
    };
    logFunction.dir = function(object, path){
      if(console.dir)
      {
        console.dir(object, path);
        return;
      }
      logFunction.log(JSON.stringify(object), path);
    };
    logFunction.info = function(message, path){
      if(console.info)
      {
        console.info(message, path);
        return;
      }
      logFunction.log(blue + message + reset, path);
    };
    logFunction.warn = function(message, path){
      if(console.warn)
      {
        console.warn(message, path);
        return;
      }
      logFunction.log(blue + message + reset, path);
    };
    logFunction.track = function(category, action, label, value){
      logFunction.log('track: ' + category + ", " + action + ", " + label + ", " + value);
    };
  }
  else
  {
      var addEmit = function(name, fun){
        fun[name] = function(){
          var newArgs = [];
          newArgs.push(name);
          arguments.map(function(arg){
            newArgs.push(arg);
          });
          emitter.emit.apply(null, newArgs);
        };
      };
      addEmit('log', logFunction);
      addEmit('error', logFunction);
      addEmit('dir', logFunction);
      addEmit('info', logFunction);
      addEmit('warn', logFunction);
      addEmit('track', logFunction);
  }


  return module.exports.addWrap(logFunction);
};


module.exports.info = function(message){
  module.exports();
};

module.exports.error = function(error){
  module.exports(red + message + reset);
  if(console)
  {
    console.error(error);
  }
  
};

module.exports.addWrap = function (f) {
  "use strict";
  f.wrap = function (name) {

    var newFunc = function (message, path) {
      if(path)
      {
        f(message, name + ": " + path);
      }
      else
      {
        f(message, name);
      }
    };
    var combinePath = function(name, path){
      if(path)
      {
        return name + ": " + path
      }
      return name;

    };
    newFunc.error = function(error, path){
      f.error(error, combinePath(name, path));
    };
    newFunc.info = function(message, path){
      f.info(message, combinePath(name, path));
    };
    newFunc.dir = function(object, path){
      f.dir(object, combinePath(name, path));
    };
    newFunc.log= function(message, path){
      f.log(message, combinePath(name, path));
    };
    newFunc.track = f.track;
    return module.exports.addWrap(newFunc);
  };
  return f;
};

module.exports.fake = function(){
  var that = function(){};
  that.log = function(){};
  that.error =function(){};
  that.dir = function(){};
  that.track = function(){};
  var t = module.exports.addWrap(that);
  return t;
}


module.exports.logz = function logger() {
  "use strict";
  console.log(logger.caller);
};

module.exports.emitterToLog =  function(emitter, log){

  var logFunctions = ['log', 'error', 'dir', 'warn', 'info'];
logFunctions.map(function(name){
  emitter.on(name, function(){
    log[name].apply(this, arguments);
  });
});
};