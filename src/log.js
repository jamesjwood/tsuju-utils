/*jshint node: true */
var red, blue, reset;
red   = '\u001b[31m';
green  = '\u001b[32m';
yellow  = '\u001b[33m';
blue  = '\u001b[34m';
pink  = '\u001b[35m';
reset = '\u001b[0m';


var supportsColours = (typeof window === 'undefined');


process.env.LOG =  process.env.LOG || 'true';

var logToConsole= function(){
  return process.env.LOG;
};


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
      if(process.env.LOG === 'true')
      {
        if(path)
        {
          console.log('LOG: ' + path + ": ",  message);
        }
        else
        {
          console.log('LOG:', message);
        }
        
      }
    };

    logFunction.log = logFunction;

    logFunction.error = function(error, path){
      //TODO: chrome: console.log("%c" + msg, "color:" + color + ";font-weight:bold;");
        if(supportsColours)
        {
          process.stdout.write(red);
        }

        if(error.stack)
        {
          error.stackArray = error.stack.split('\n'); //.slice(1);
        }
        if(path)
        {
          error.path = path;
        }
        path = path || '';

        console.error('ERROR: ' + path, error);

        if(supportsColours)
        {
          process.stdout.write(reset);
        }
    };

    logFunction.dir = function(object, path){
       if(process.env.LOG === 'true')
      {

        if(supportsColours)
        {
          process.stdout.write(pink);
        }
        if(typeof window !== 'undefined')
        {
          if(path)
          {
            console.dir('DIR: ' + path, object);
          }
          else
          {
            console.dir('DIR:', object);
          }
        }
        else
        {
          if(path)
          {
            console.log('DIR: ' + path, object);
          }
          else
          {
            console.log('DIR:', object);
          }   
        }


        if(supportsColours)
        {
          process.stdout.write(reset);
        }
      }
    };
    logFunction.info = function(message, path){

     if(process.env.LOG === 'true')
      {

        if(supportsColours)
        {
          process.stdout.write(green);
        }
        console.log('INFO: ' + path + ': ' + message);
        if(supportsColours)
        {
          process.stdout.write(reset);
        }
      }
    };


    logFunction.warn = function(message, path){
     if(process.env.LOG === 'true')
      {

        if(supportsColours)
        {
          process.stdout.write(yellow);
        }
        console.warn('INFO: ' + path + ': ' + message);
        if(supportsColours)
        {
          process.stdout.write(reset + '\n');
        }
      }
    };


    logFunction.track = function(category, action, label, value){
      if(process.env.LOG === 'true')
      {
        if(supportsColours)
        {
          process.stdout.write(blue);
        }
        console.log('TRACK: ' + category + ", " + action + ", " + label + ", " + value);
        if(supportsColours)
        {
          process.stdout.write(reset + '\n');
        }
      }
    };
  }
  else
  {

      logFunction = function(message, path){
        emitter.emit('log', message, path);
      };

      logFunction.log= logFunction;

      logFunction.dir = function(ob, path){
        emitter.emit('dir', ob, path);
      };
      logFunction.error = function(error, path){
        emitter.emit('error', error, path);
      };
      logFunction.warn = function(message, path){
        emitter.emit('warn', message, path);
      };
      logFunction.info = function(message, path){
        emitter.emit('info', message, path);
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
  emitter.on('info', function(message, path){
    log.info(message, path);
  });
};