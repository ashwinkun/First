'use strict';

(function() {
	// Cutomers Controller Spec
	describe('Cutomers Controller Tests', function() {
		// Initialize global variables
		var CutomersController,
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

			// Initialize the Cutomers controller.
			CutomersController = $controller('CutomersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Cutomer object fetched from XHR', inject(function(Cutomers) {
			// Create sample Cutomer using the Cutomers service
			var sampleCutomer = new Cutomers({
				name: 'New Cutomer'
			});

			// Create a sample Cutomers array that includes the new Cutomer
			var sampleCutomers = [sampleCutomer];

			// Set GET response
			$httpBackend.expectGET('cutomers').respond(sampleCutomers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cutomers).toEqualData(sampleCutomers);
		}));

		it('$scope.findOne() should create an array with one Cutomer object fetched from XHR using a cutomerId URL parameter', inject(function(Cutomers) {
			// Define a sample Cutomer object
			var sampleCutomer = new Cutomers({
				name: 'New Cutomer'
			});

			// Set the URL parameter
			$stateParams.cutomerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/cutomers\/([0-9a-fA-F]{24})$/).respond(sampleCutomer);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cutomer).toEqualData(sampleCutomer);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Cutomers) {
			// Create a sample Cutomer object
			var sampleCutomerPostData = new Cutomers({
				name: 'New Cutomer'
			});

			// Create a sample Cutomer response
			var sampleCutomerResponse = new Cutomers({
				_id: '525cf20451979dea2c000001',
				name: 'New Cutomer'
			});

			// Fixture mock form input values
			scope.name = 'New Cutomer';

			// Set POST response
			$httpBackend.expectPOST('cutomers', sampleCutomerPostData).respond(sampleCutomerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Cutomer was created
			expect($location.path()).toBe('/cutomers/' + sampleCutomerResponse._id);
		}));

		it('$scope.update() should update a valid Cutomer', inject(function(Cutomers) {
			// Define a sample Cutomer put data
			var sampleCutomerPutData = new Cutomers({
				_id: '525cf20451979dea2c000001',
				name: 'New Cutomer'
			});

			// Mock Cutomer in scope
			scope.cutomer = sampleCutomerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/cutomers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/cutomers/' + sampleCutomerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid cutomerId and remove the Cutomer from the scope', inject(function(Cutomers) {
			// Create new Cutomer object
			var sampleCutomer = new Cutomers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Cutomers array and include the Cutomer
			scope.cutomers = [sampleCutomer];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/cutomers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCutomer);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.cutomers.length).toBe(0);
		}));
	});
}());