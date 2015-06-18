'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Cutomer = mongoose.model('Cutomer'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, cutomer;

/**
 * Cutomer routes tests
 */
describe('Cutomer CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Cutomer
		user.save(function() {
			cutomer = {
				name: 'Cutomer Name'
			};

			done();
		});
	});

	it('should be able to save Cutomer instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cutomer
				agent.post('/cutomers')
					.send(cutomer)
					.expect(200)
					.end(function(cutomerSaveErr, cutomerSaveRes) {
						// Handle Cutomer save error
						if (cutomerSaveErr) done(cutomerSaveErr);

						// Get a list of Cutomers
						agent.get('/cutomers')
							.end(function(cutomersGetErr, cutomersGetRes) {
								// Handle Cutomer save error
								if (cutomersGetErr) done(cutomersGetErr);

								// Get Cutomers list
								var cutomers = cutomersGetRes.body;

								// Set assertions
								(cutomers[0].user._id).should.equal(userId);
								(cutomers[0].name).should.match('Cutomer Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Cutomer instance if not logged in', function(done) {
		agent.post('/cutomers')
			.send(cutomer)
			.expect(401)
			.end(function(cutomerSaveErr, cutomerSaveRes) {
				// Call the assertion callback
				done(cutomerSaveErr);
			});
	});

	it('should not be able to save Cutomer instance if no name is provided', function(done) {
		// Invalidate name field
		cutomer.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cutomer
				agent.post('/cutomers')
					.send(cutomer)
					.expect(400)
					.end(function(cutomerSaveErr, cutomerSaveRes) {
						// Set message assertion
						(cutomerSaveRes.body.message).should.match('Please fill Cutomer name');
						
						// Handle Cutomer save error
						done(cutomerSaveErr);
					});
			});
	});

	it('should be able to update Cutomer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cutomer
				agent.post('/cutomers')
					.send(cutomer)
					.expect(200)
					.end(function(cutomerSaveErr, cutomerSaveRes) {
						// Handle Cutomer save error
						if (cutomerSaveErr) done(cutomerSaveErr);

						// Update Cutomer name
						cutomer.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Cutomer
						agent.put('/cutomers/' + cutomerSaveRes.body._id)
							.send(cutomer)
							.expect(200)
							.end(function(cutomerUpdateErr, cutomerUpdateRes) {
								// Handle Cutomer update error
								if (cutomerUpdateErr) done(cutomerUpdateErr);

								// Set assertions
								(cutomerUpdateRes.body._id).should.equal(cutomerSaveRes.body._id);
								(cutomerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Cutomers if not signed in', function(done) {
		// Create new Cutomer model instance
		var cutomerObj = new Cutomer(cutomer);

		// Save the Cutomer
		cutomerObj.save(function() {
			// Request Cutomers
			request(app).get('/cutomers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Cutomer if not signed in', function(done) {
		// Create new Cutomer model instance
		var cutomerObj = new Cutomer(cutomer);

		// Save the Cutomer
		cutomerObj.save(function() {
			request(app).get('/cutomers/' + cutomerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', cutomer.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Cutomer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cutomer
				agent.post('/cutomers')
					.send(cutomer)
					.expect(200)
					.end(function(cutomerSaveErr, cutomerSaveRes) {
						// Handle Cutomer save error
						if (cutomerSaveErr) done(cutomerSaveErr);

						// Delete existing Cutomer
						agent.delete('/cutomers/' + cutomerSaveRes.body._id)
							.send(cutomer)
							.expect(200)
							.end(function(cutomerDeleteErr, cutomerDeleteRes) {
								// Handle Cutomer error error
								if (cutomerDeleteErr) done(cutomerDeleteErr);

								// Set assertions
								(cutomerDeleteRes.body._id).should.equal(cutomerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Cutomer instance if not signed in', function(done) {
		// Set Cutomer user 
		cutomer.user = user;

		// Create new Cutomer model instance
		var cutomerObj = new Cutomer(cutomer);

		// Save the Cutomer
		cutomerObj.save(function() {
			// Try deleting Cutomer
			request(app).delete('/cutomers/' + cutomerObj._id)
			.expect(401)
			.end(function(cutomerDeleteErr, cutomerDeleteRes) {
				// Set message assertion
				(cutomerDeleteRes.body.message).should.match('User is not logged in');

				// Handle Cutomer error error
				done(cutomerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Cutomer.remove().exec();
		done();
	});
});