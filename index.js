exports.uuid = function () {
  "use strict";
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

exports.cb = function (callback, innerFunction) {
  "use strict";
  if (!callback) {
    throw new Error('callback was not passed');
  }
  var that = function () {
    var newArgs = [];
    try {
      var error = arguments[0];
      if (error) {
        //callback(error);
        process.nextTick(function () {
          callback(error);
        });
        return;
      }

      for (var i = 1; i < arguments.length; i++) {
        newArgs.push(arguments[i]);
      }

    }
    catch (er) {
      //var newError = new Error("Error at listrbro.cb");
      //newError.innerException  = er;
      if (callback) {
        //callback(er);
        process.nextTick(function () {
          callback(er);
        });
        return;
      }
      else {
        throw er;
      }
    }
    try {
      innerFunction.apply(this, newArgs);
    }
    catch (er2) {
      //callback(er2);
      process.nextTick(function () {
        callback(er2);
      });
    }
  };
  if (callback.task) {
    that.task = callback.task;
  }

  that.log = function (message) {
    callback.log(message);
  };

  return that;
};