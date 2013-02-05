module.exports = function (logger, name, functionToBeWrapped) {
  "use strict";

  console.dir();

  var newLogger = {
		log: function (message) {
    logger.log(name + ": " + message);
  }
};


  var wrappedFunction = function () {
    newLogger.log('start');
    var results = functionToBeWrapped.apply(newLogger, arguments);
    newLogger.log('end');
    return results;
  };
  return wrappedFunction;
};

