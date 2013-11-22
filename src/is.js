/*jshint node: true */

var is = require('is-js');


var isT = function(i, type, alias){
	'use strict';
	alias = alias || type;
	i[type] = function(value, name){
		name = name || 'variable';
		if(!is[alias](value))
		{
			var actualType = typeof(value);

			var e = new Error(name + ' was a ' + actualType + ' not a '  + type);
			throw e;
		}
	};
};

var that = {};

isT(that, 'function', 'fn');
isT(that, 'object');
isT(that, 'string');
isT(that, 'number');
isT(that, 'array');

module.exports = that;