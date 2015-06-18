'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Cutomer = mongoose.model('Cutomer'),
	_ = require('lodash');

/**
 * Create a Cutomer
 */
exports.create = function(req, res) {
	var cutomer = new Cutomer(req.body);
	cutomer.user = req.user;

	cutomer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cutomer);
		}
	});
};

/**
 * Show the current Cutomer
 */
exports.read = function(req, res) {
	res.jsonp(req.cutomer);
};

/**
 * Update a Cutomer
 */
exports.update = function(req, res) {
	var cutomer = req.cutomer ;

	cutomer = _.extend(cutomer , req.body);

	cutomer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cutomer);
		}
	});
};

/**
 * Delete an Cutomer
 */
exports.delete = function(req, res) {
	var cutomer = req.cutomer ;

	cutomer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cutomer);
		}
	});
};

/**
 * List of Cutomers
 */
exports.list = function(req, res) { 
	Cutomer.find().sort('-created').populate('user', 'displayName').exec(function(err, cutomers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cutomers);
		}
	});
};

/**
 * Cutomer middleware
 */
exports.cutomerByID = function(req, res, next, id) { 
	Cutomer.findById(id).populate('user', 'displayName').exec(function(err, cutomer) {
		if (err) return next(err);
		if (! cutomer) return next(new Error('Failed to load Cutomer ' + id));
		req.cutomer = cutomer ;
		next();
	});
};

/**
 * Cutomer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.cutomer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
