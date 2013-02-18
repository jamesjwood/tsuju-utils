module.exports = function () {
  "use strict";

  var logFunction;
  if (arguments.length === 1) {
    var emitter = arguments[0];
    logFunction = function (message) {
      emitter.emit('log', message);
    };
  }
  else {
    logFunction = function (message) {
      if(typeof message == 'object')
      {
        console.dir(message);
      }
      else
      {
        console.log(message);
      }
    };
  }

  return module.exports.addWrap(logFunction);
};

module.exports.addWrap = function (f) {
  "use strict";
  f.wrap = function (name) {
    var newFunc = function (message) {
      f(name + ": " + message);
    };
    return module.exports.addWrap(newFunc);
  };
  return f;
};



module.exports.logz = function logger() {
  "use strict";
  console.log(logger.caller);
};