/*jslint node: true */
/*global describe */
/*global it */
/*global test */
/*global setup */
/*global teardown */
/*global before */
/*global after */

var events = require('events');
var sinon = require('sinon');
var assert = require('assert');

var lib = require('../src/log.js');



describe('log', function () {
	'use strict';


	var node = (typeof window === 'undefined');

	var out = [];

	before(function(){
		sinon.stub(process.stdout, 'write', function(message){
			out.push(message);
		});
	});

	after(function(){
		process.stdout.write.restore();
	});
/*
	it('should log to console', function () {
		var logr = lib();
		logr('hello');
		assert.equal(out.pop(), '"LOG: hello\n"');
		logr('hello', 'at start');
		assert.equal(out.pop(), 'LOG: at start: hello');
	});

	it('should dir to console', function () {
		var logr = lib();
		var ob ={message: 'hello2'};
		logr.dir(ob);
		assert.equal(out.pop(), ob);
		logr.dir(ob, 'at start');
		assert.equal(dir, ob);

	});


	it('should error to console', function () {
		var logr = lib();
		var err = {message: 'hello3'};
		logr.error(err);
		assert.equal(error, err);
		logr.error(err, 'at start');
		if(node)
		{
			assert.equal(log, '\u001b[31mat start: ' + JSON.stringify(err) + '\u001b[0m');
		}
		else
		{
			assert.equal(log, 'ERROR: at start: ' + JSON.stringify(err));
		}
		assert.equal(error, err);
	});

	it('be able to wrap', function () {
		var logr = lib();
		var logs = logr.wrap('test');
		logs('hello4');
		assert.equal(log, 'test: hello4');
		logs('hello5', 'at start');
		assert.equal(log, 'test: at start: hello5');
	});

	it('log to emitter', function () {

		var type;
		var mess;
		var path;
		var fakeEmit  = {
			emit: function(t, m, p){
				type = t;
				mess = m;
				path = p;
			}
		};
		var logr = lib(fakeEmit);
		logr('hello5');
		assert.equal(type, 'log');
		assert.equal(mess, 'hello5');

		var err = {message: 'hello6'};
		logr.error(err);
		assert.equal(type, 'error');
		assert.equal(mess, err);

		logr.error(err, 'at start');

		assert.equal(type, 'error');
		assert.equal(mess, err);
		assert.equal(path, 'at start');

		var wlog = logr.wrap('test');

		wlog.error(err);
		assert.equal(type, 'error');
		assert.equal(mess, err);
		assert.equal(path, 'test');

		wlog.error(err, 'at start');
		assert.equal(type, 'error');
		assert.equal(mess, err);
		assert.equal(path, 'test: at start');


		wlog.dir(err, 'at start');
		assert.equal(type, 'dir');
		assert.equal(mess, err);
		assert.equal(path, 'test: at start');

	});

	it('emitterToLog', function(){
		var emitter = new events.EventEmitter();
		var logr = lib(emitter).wrap('in');
		var output = lib().wrap('out');
		lib.emitterToLog(emitter, output);

		logr('hello7');
		assert.equal(log, 'out: in: hello7');
		logr('hello8', 'at start');
		assert.equal(log, 'out: in: at start: hello8');

		var ob = {message: 'hello9'};
		logr.dir(ob, 'at location');
		assert.equal(dir, ob);
		assert.equal(log, 'out: in: at location: ' + JSON.stringify(dir));


		var err = {message: 'hello9'};
		logr.error(err, 'at location');
		assert.equal(error, err);
		if(node)
		{
			assert.equal(log, '\u001b[31mout: in: at location: ' + JSON.stringify(err) + '\u001b[0m');
		}
		else
		{
			assert.equal(log, 'ERROR: out: in: at location: ' + JSON.stringify(err));
		}
		
	});
*/
});