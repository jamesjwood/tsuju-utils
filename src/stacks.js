var safe = require('./safe.js');
var log = require('./log.js');
var mylog  = log();


var addAsync = function addAsync(a, b, cbk){
	process.nextTick(safe(cbk, function addAsync_Callback(){
		cbk.log('adding');
		if(a ===3)
		{
			throw new Error("I dont like 3's");
		}
		cbk(null, a + b, b);
	}));
};

var Process = function Process(asyncFunction, onFail){
	var name = asyncFunction.name;

	var myDone = function myDone(error){
		that.resolved = true;
		if(error)
		{
			error.args = that.args;
			that.successful = false;
			if(that.fail){
				that.fail(error);
			}
			else
			{
				throw error;
			}
		}
		else
		{
			that.successful = true;
			var newArgs = Array.prototype.slice.call(arguments, 1);

			that.then.apply(this, newArgs);
		}
	};

	myDone.log = function(message){
		if(that.log)
		{
			that.log(name + ": " + message);
		}
	};

	var that = safe(done, function(){
			that.args = Array.prototype.slice.call(arguments, 0);
			var args = Array.prototype.slice.call(arguments, 0);
			args.push(myDone);
			asyncFunction.apply(this, args);
	});


	that.then=null;
	that.fail=onFail;
	that.resolved = false;
	that.successful=  null;
	
	return that;
}

var done  = function(error, val){
	mylog.error(error);
}





var j = new Process(addAsync, done);
j(3, 2);
var k = new Process(addAsync, done);

j.then = k;
j.log= mylog.wrap('add 1');
k.log= mylog.wrap('add 2');


k.then = function(val){
	console.log(val);
};
