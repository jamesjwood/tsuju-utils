/*jslint node: true */
/*global describe */
/*global it */
/*global test */
/*global setup */
/*global teardown */

var events = require('events');
var sinon = require('sinon');
var assert = require('assert');

var lib = require('../src/log.js');



describe('log', function () {
	'use strict';

	var log;
	var dir;
	var error;
	var warn;

	before(function(){
		sinon.stub(console, 'dir', function(message){
			dir = message;
		});
		sinon.stub(console, 'log', function(message){
			log = message;
		});
		sinon.stub(console, 'error', function(message){
			error = message;
		});
		sinon.stub(console, 'warn', function(message){
			warn = message;
		});
	});

	after(function(){

		console.log.restore();
		console.dir.restore();
		console.error.restore();
		console.warn.restore();
	});

	it('should log to console', function () {
		var logr = lib();
		logr('hello');
		assert.equal(log, 'hello');
		logr('hello', 'at start');
		assert.equal(log, 'at start: hello');
	});

	it('should dir to console', function () {
		var logr = lib();
		var ob ={message: 'hello2'};
		logr.dir(ob);
		assert.equal(log, JSON.stringify(ob));
		assert.equal(dir, ob);
		logr.dir(ob, 'at start');
		assert.equal(log, 'at start: ' + JSON.stringify(ob));
		assert.equal(dir, ob);

	});

	it('should error to console', function () {
		var logr = lib();
		var err = {message: 'hello3'};
		logr.error(err);
		assert.equal(error, err);
		logr.error(err, 'at start');
		assert.equal(log, '\u001b[31mat start: ' + JSON.stringify(err) + '\u001b[0m');
		assert.equal(error, err);
	});

	it('be able to wrap', function () {
		var logr = lib();
		var logr = logr.wrap('test');
		logr('hello4');
		assert.equal(log, 'test: hello4');
		logr('hello5', 'at start');
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
		}
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
		var output = lib().wrap('out')
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
		assert.equal(log, '\u001b[31mout: in: at location: ' + JSON.stringify(err) + '\u001b[0m');
	});
});