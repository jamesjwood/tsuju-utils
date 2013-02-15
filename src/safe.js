

module.exports = function(unsafe){
  return alwaysAsync(catchSyncronousErrors(unsafe));
}



var catchSyncronousErrors = function (unsafeFunction){
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

var argumentsToArray = function(oldArgs){
      var newArgs = [];
      for(var i = 0 ; i < oldArgs.length-1; i ++)
      {
          newArgs.push(oldArgs[i]);
      } 
      return newArgs;
};

var alwaysAsync = function(maybeAsync){
  var that = function(){
      var myArgs = arguments;
      process.nextTick(function(){
        maybeAsync.apply(this, myArgs);
      }
    };
  return that;
};