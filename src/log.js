


var addWrap  = function(f){
	f.wrap = function(name){
		var newFunc = function(message){
			f(name + ": " + message);
		};
		return addWrap(newFunc);
	};
	return f;
};


module.exports = function(){
 	var logFunction = function(message){
 		console.log(message)
 	}
 	return addWrap(logFunction);
};



module.exports.logz = function logger (){
	console.log(logger.caller);
};