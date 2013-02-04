module.exports = function(message){
	logger.apply(this, [message]);
};

var logger = "";

module.exports.setLogger = function(log){
	logger = log;
};