var q = require('q');

q.longStackSupport = true;

var add = function add(a, b){
	var args = arguments;
	var deferred = q.defer();
	process.nextTick(function addtick(){
		try
		{
			deferred.notify('checking');
			if(a===5)
			{
				throw new Error('5 not allowed');
			}
			deferred.notify('ok, invoking delayed');
			deferred.notify('nextTick');
			deferred.resolve(b + a);
		}
		catch(e)
		{
			e.args = args;
			deferred.reject(e);
		}
	});

	return deferred.promise;
};
var log = require('./log');
var mylog = log();


var onDone = function(error){
	if(error)
	{
 		mylog('ERROR 1: ' + error);
 		mylog(error.stack);
 		mylog(error.args);
 		return;
	}
 	mylog('SUCCESS');
}

var a1 = add(2, 3)
.then(function addNext(value){
	mylog('RESULT 1: ' + value);
	return add(value, 3)
	.then(function finish(value){
		console.log('RESULT 2: ' + value);
		onDone();
	}, onDone, mylog)
	.done();
}, onDone, mylog).done();

/*
var a2 = a1
.then(function finishNext(value){
	return add (3, value).then(function(val){
		console.log('RESULT 2: ' + value);
	}, function failed(error){
		console.log('ERROR: ' + error);
		console.log(error.stack);
	}, function writeProgress(progress){
		console.log('PROGRESS 2: getInitial: '  + progress);
	});
}).done();
*/