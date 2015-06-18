'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var cutomers = require('../../app/controllers/cutomers.server.controller');

	// Cutomers Routes
	app.route('/cutomers')
		.get(cutomers.list)
		.post(users.requiresLogin, cutomers.create);

	app.route('/cutomers/:cutomerId')
		.get(cutomers.read)
		.put(users.requiresLogin, cutomers.hasAuthorization, cutomers.update)
		.delete(users.requiresLogin, cutomers.hasAuthorization, cutomers.delete);

	// Finish by binding the Cutomer middleware
	app.param('cutomerId', cutomers.cutomerByID);
};
