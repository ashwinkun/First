'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	customer = mongoose.model('customer'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, customer;

/**
 * customer routes tests
 */
describe('customer CRUD tests', function() {
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

		// Save a user to the test db and create new customer
		user.save(function() {
			customer = {
				name: 'customer Name'
			};

			done();
		});
	});

	it('should be able to save customer instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new customer
				agent.post('/customers')
					.send(customer)
					.expect(200)
					.end(function(customerSaveErr, customerSaveRes) {
						// Handle customer save error
						if (customerSaveErr) done(customerSaveErr);

						// Get a list of customers
						agent.get('/customers')
							.end(function(customersGetErr, customersGetRes) {
								// Handle customer save error
								if (customersGetErr) done(customersGetErr);

								// Get customers list
								var customers = customersGetRes.body;

								// Set assertions
								(customers[0].user._id).should.equal(userId);
								(customers[0].name).should.match('customer Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save customer instance if not logged in', function(done) {
		agent.post('/customers')
			.send(customer)
			.expect(401)
			.end(function(customerSaveErr, customerSaveRes) {
				// Call the assertion callback
				done(customerSaveErr);
			});
	});

	it('should not be able to save customer instance if no name is provided', function(done) {
		// Invalidate name field
		customer.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new customer
				agent.post('/customers')
					.send(customer)
					.expect(400)
					.end(function(customerSaveErr, customerSaveRes) {
						// Set message assertion
						(customerSaveRes.body.message).should.match('Please fill customer name');

						// Handle customer save error
						done(customerSaveErr);
					});
			});
	});

	it('should be able to update customer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new customer
				agent.post('/customers')
					.send(customer)
					.expect(200)
					.end(function(customerSaveErr, customerSaveRes) {
						// Handle customer save error
						if (customerSaveErr) done(customerSaveErr);

						// Update customer name
						customer.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing customer
						agent.put('/customers/' + customerSaveRes.body._id)
							.send(customer)
							.expect(200)
							.end(function(customerUpdateErr, customerUpdateRes) {
								// Handle customer update error
								if (customerUpdateErr) done(customerUpdateErr);

								// Set assertions
								(customerUpdateRes.body._id).should.equal(customerSaveRes.body._id);
								(customerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of customers if not signed in', function(done) {
		// Create new customer model instance
		var customerObj = new customer(customer);

		// Save the customer
		customerObj.save(function() {
			// Request customers
			request(app).get('/customers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single customer if not signed in', function(done) {
		// Create new customer model instance
		var customerObj = new customer(customer);

		// Save the customer
		customerObj.save(function() {
			request(app).get('/customers/' + customerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', customer.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete customer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new customer
				agent.post('/customers')
					.send(customer)
					.expect(200)
					.end(function(customerSaveErr, customerSaveRes) {
						// Handle customer save error
						if (customerSaveErr) done(customerSaveErr);

						// Delete existing customer
						agent.delete('/customers/' + customerSaveRes.body._id)
							.send(customer)
							.expect(200)
							.end(function(customerDeleteErr, customerDeleteRes) {
								// Handle customer error error
								if (customerDeleteErr) done(customerDeleteErr);

								// Set assertions
								(customerDeleteRes.body._id).should.equal(customerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete customer instance if not signed in', function(done) {
		// Set customer user
		customer.user = user;

		// Create new customer model instance
		var customerObj = new customer(customer);

		// Save the customer
		customerObj.save(function() {
			// Try deleting customer
			request(app).delete('/customers/' + customerObj._id)
			.expect(401)
			.end(function(customerDeleteErr, customerDeleteRes) {
				// Set message assertion
				(customerDeleteRes.body.message).should.match('User is not logged in');

				// Handle customer error error
				done(customerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		customer.remove().exec();
		done();
	});
});
