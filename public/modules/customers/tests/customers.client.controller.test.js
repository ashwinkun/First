'use strict';

(function() {
	// customers Controller Spec
	describe('customers Controller Tests', function() {
		// Initialize global variables
		var customersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the customers controller.
			customersController = $controller('customersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one customer object fetched from XHR', inject(function(Customers) {
			// Create sample customer using the customers service
			var samplecustomer = new Customers({
				name: 'New customer'
			});

			// Create a sample customers array that includes the new customer
			var samplecustomers = [samplecustomer];

			// Set GET response
			$httpBackend.expectGET('customers').respond(samplecustomers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.customers).toEqualData(samplecustomers);
		}));

		it('$scope.findOne() should create an array with one customer object fetched from XHR using a customerId URL parameter', inject(function(Customers) {
			// Define a sample customer object
			var samplecustomer = new Customers({
				name: 'New customer'
			});

			// Set the URL parameter
			$stateParams.customerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/customers\/([0-9a-fA-F]{24})$/).respond(samplecustomer);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.customer).toEqualData(samplecustomer);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Customers) {
			// Create a sample customer object
			var samplecustomerPostData = new Customers({
				name: 'New customer'
			});

			// Create a sample customer response
			var samplecustomerResponse = new Customers({
				_id: '525cf20451979dea2c000001',
				name: 'New customer'
			});

			// Fixture mock form input values
			scope.name = 'New customer';

			// Set POST response
			$httpBackend.expectPOST('customers', samplecustomerPostData).respond(samplecustomerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the customer was created
			expect($location.path()).toBe('/customers/' + samplecustomerResponse._id);
		}));

		it('$scope.update() should update a valid customer', inject(function(Customers) {
			// Define a sample customer put data
			var samplecustomerPutData = new Customers({
				_id: '525cf20451979dea2c000001',
				name: 'New customer'
			});

			// Mock customer in scope
			scope.customer = samplecustomerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/customers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/customers/' + samplecustomerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid customerId and remove the customer from the scope', inject(function(Customers) {
			// Create new customer object
			var samplecustomer = new Customers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new customers array and include the customer
			scope.customers = [samplecustomer];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/customers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplecustomer);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.customers.length).toBe(0);
		}));
	});
}());
