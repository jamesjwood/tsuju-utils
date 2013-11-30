/*var safe = require('./safe.js');
var log = require('./log.js');
var mylog  = log();


var addAsync = function addAsync(a, b, onDone, onFail, onLog){
	process.nextTick(safe(onFail, function addAsync(){
		onLog('testing');
		if(a ===3)
		{
			var e =  new Error("I dont like 3's");
			throw e;
		}
		onLog('adding');
		onDone(null, a + b, b);
	}));
};

var promise = module.exports = function promise(asyncFunction, onFail, onLog){
	var name = asyncFunction.aName || asyncFunction.name;

	var then;
	console.log('making promise for ' + name);

	var myDone = function myDone(){
		that.resolved = true;
		that.successful = true;
		var newArgs = Array.prototype.slice.call(arguments, 1);
		myLog('end');
		then.apply(this, newArgs);
	};

	var myFail= function(error){
		that.resolved = true;
		that.successful = false;
		if(that.location)
		{
			if(!error.trace)
			{
				error.trace = [];
				var t = error.stack.split('\n')[1];
				error.trace.push(t);
				error.args = that.args;
			}
			error.trace.push(that.location);
		}
		onFail.apply(this, arguments);
	}

	var myLog = onLog.wrap(name);

	var that = safe(myFail, function(){
			myLog('start');
			that.args = Array.prototype.slice.call(arguments, 0);
			var args = Array.prototype.slice.call(arguments, 0);

			args.push(myDone);
			args.push(myFail);
			args.push(myLog);

			asyncFunction.apply(this, args);
			return that;
	});

	that.name = name;
	that.then = function(t){
		then=t;
		return that;
	};
	that.fail=onFail;
	that.resolved = false;
	that.successful=  null;
	that.log = onLog;
	if(promise.longStackTraces){
		var loc = new Error().stack.split('\n')[2];
		that.location = loc;
	}
	return that;
}

promise.longStackTraces = false;

promise.fromCallback = function(callbackFunction){
	var myFunction = function(){
		var args = Array.prototype.slice.call(arguments, 0);
		var myLog = args.pop();
		var myFail = args.pop();
		var myDone = args.pop();

		var newCallback = function(){
			var cbkArgs = Array.prototype.slice.call(arguments, 0);
			var error = cbkArgs[0];
			if(error)
			{
				myFail(error);
			}
			else
			{
				myDone.apply(this, cbkArgs.slice(1));
			}
		};
		newCallback.name = callbackFunction.name;
		newCallback.log=myLog;
		args.push(newCallback);
		callbackFunction.apply(this, args);
	};

	myFunction.aName = callbackFunction.name;
	return myFunction;
}

var multiply = function multiply(a, b, cbk){
	process.nextTick(safe(cbk, function multiply(){
		cbk.log('Multiplying ' + a.toString() + ' with ' + b.toString());
		if(a===6)
		{
			var e = new Error('I dont like 6s');
			throw e;
		}
		cbk(null, a*b);
	}));
};


var fail  = function fail(error){
	mylog.error(error);
}

promise.longStackTraces = true;


var f = function f(){
	var l = promise(function addTwice(a, b, onDone, onFail, onLog){
		var j = promise(addAsync, onFail, onLog);
		var k = promise(addAsync, onFail, onLog);
		var m = promise(promise.fromCallback(multiply), onFail, onLog);

		console.log("returned" + j(a, b));
		j.then(k);
		k.then(m);
		m.then(onDone);
	}, fail, mylog);
	l(2, 2);
	l.then(function final(val){
		mylog("sucess: " + val);
	});
}();


var p_Add = function(a, b){
	return promise(addAsync);
}



p_Add(1, 2)
.fail(onError)
.log(mylog)
.then(p_Add)
.then(p_Multiply)
.then(done);



*/
