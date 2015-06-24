'use strict';

// customers controller
angular.module('customers').controller('CustomersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Customers',
	function($scope, $stateParams, $location, Authentication, Customers) {
		$scope.authentication = Authentication;

		// Create new customer
		$scope.create = function() {
			// Create new customer object
			var customer = new Customers ({
				firstName: this.firstName,
				surName:this.surName,
				suburb:this.suburb,
				country:this.country,
				industry:this.industry,
				email:this.email,
				phone:this.phone,
				referred:this.referred,
				channel:this.channel
			});
			// Redirect after save
			customer.$save(function(response) {
				console.log(response.firstName);
				$location.path('customers/' + response._id);

				// Clear form fields
				$scope.firstName ='';
				$scope.surName ='';
				$scope.suburb = '';
				$scope.country= '';
				$scope.industry= '';
				$scope.email= '';
				$scope.phone = '';
				$scope.referred = '';
				$scope.channel = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing customer
		$scope.remove = function(customer) {
			if ( customer ) {
				customer.$remove();

				for (var i in $scope.customers) {
					if ($scope.customers [i] === customer) {
						$scope.customers.splice(i, 1);
					}
				}
			} else {
				$scope.customer.$remove(function() {
					$location.path('customers');
				});
			}
		};

		// Update existing customer
		$scope.update = function() {
			var customer = $scope.customer;

			customer.$update(function() {
				$location.path('customers/' + customer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of customers
		$scope.find = function() {
			$scope.customers = Customers.query();
		};

		// Find existing customer
		$scope.findOne = function() {
			$scope.customer = Customers.get({
				customerId: $stateParams.customerId
			});
		};
	}
]);
