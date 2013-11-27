/*jshint node: true */
var red, blue, reset;
red   = '\u001b[31m';
blue  = '\u001b[34m';
green  = '\u001b[32m';
reset = '\u001b[0m';


var supportsColours = (typeof window === 'undefined');

module.exports = function () {
  "use strict";
  var emitter;
  var logFunction;
  var filter;
  if (arguments.length === 1) {
     emitter = arguments[0];
  }
  if (arguments.length === 2) {
     filter = arguments[1];
  }
  if(!emitter)
  {
    logFunction = function(message, path){
      var st;
      if(typeof console !== 'undefined')
      {
        if(path)
        {
          st  = path + ": " + message;
        }
        else
        {
          st = message;
        }
        if(filter)
        {
          if(st.substring(0, filter.length) === filter)
          {
             console.log(st);
          }
        }
        else
        {
             console.log(st);
        }
      }
    };

    logFunction.log = function(message, path){
      logFunction(message, "LOG: " + path);
    };

    logFunction.error = function(error, path){
      //TODO: chrome: console.log("%c" + msg, "color:" + color + ";font-weight:bold;");
      if(supportsColours)
      {
        process.stdout.write(red);
      }

      var newE = {};
      newE.message = error.message;
      for(var p in error)
      {
        newE[p] = error[p];
      }
      if(error.stack)
      {
        newE.stack = error.stack.split('\n').slice(1);
      }
      if(path)
      {
        newE.path = path;
      }

      process.stdout.write('ERROR:\n');
      console.error(newE);

      if(supportsColours)
      {
        process.stdout.write(reset);
      }
    };

    logFunction.dir = function(object, path){
      if(typeof console.dir !== 'undefined')
      {
        console.dir(object);
      }
      else
      {
        logFunction.log(JSON.stringify(object), path);
      }
    };
    logFunction.info = function(message, path){
      logFunction.log(message, path, blue);
      if(console.info)
      {
        console.info(message, path);
      }
    };
    logFunction.warn = function(message, path){
      logFunction.log(blue + message + reset, path);
      if(console.warn)
      {
        console.warn(message, path);
        return;
      }
    };
    logFunction.track = function(category, action, label, value){
      logFunction.log('track: ' + category + ", " + action + ", " + label + ", " + value);
    };
  }
  else
  {
      logFunction = function(message, path){
        emitter.emit('log', message, path);
      };

      logFunction.log = function(message, path){
        logFunction(message, path);
      };
      logFunction.dir = function(ob, path){
        emitter.emit('dir', ob, path);
      };
      logFunction.error = function(error, path){
        emitter.emit('error', error, path);
      };
      logFunction.warn = function(message, path){
        emitter.emit('warn', message, path);
      };
  }

  return module.exports.addWrap(logFunction);
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
        return name + ": " + path;
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
    newFunc.warn= function(message, path){
      f.warn(message, combinePath(name, path));
    };
    newFunc.track = f.track;
    return module.exports.addWrap(newFunc);
  };
  return f;
};

module.exports.fake = function(){
  "use strict";
  var that = function(){};
  that.log = function(){};
  that.error =function(){};
  that.dir = function(){};
  that.track = function(){};
  that.warn = function(){};
  var t = module.exports.addWrap(that);
  return t;
};


module.exports.logz = function logger() {
  "use strict";
  console.log(logger.caller);
};

module.exports.emitterToLog =  function(emitter, log){
  "use strict";
  emitter.on('log', function(message, path){
    log.log(message, path);
  });
  emitter.on('dir', function(message, path){
    log.dir(message, path);
  });
  emitter.on('error', function(message, path){
    log.error(message, path);
  });
  emitter.on('warn', function(message, path){
    log.warn(message, path);
  });
};