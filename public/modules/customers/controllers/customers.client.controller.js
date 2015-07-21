'use strict';

// customers controller
angular.module('customers').controller('CustomersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Customers','$modal', '$log',
	function($scope, $stateParams, $location, Authentication, Customers,$modal, $log) {
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
			//	$location.path('customers/' + customer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of customers
		$scope.find = function() {
			$scope.customers = Customers.query();
		};

		this.modalUpdate = function (size,selectedCustomer) {

		var modalInstance = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'modules/customers/views/edit-customer.client.view.html',
		      controller: function ($scope, $modalInstance, customer) {
						$scope.customer = customer;
						$scope.ok = function () {
							$modalInstance.close($scope.customer);
							this.update();
						};

						$scope.cancel = function () {
								$modalInstance.dismiss('cancel');
							};
					},
		      size: size,
		      resolve: {
		        customer: function () {
		          return selectedCustomer;
		        }
		      }
		    });

		    modalInstance.result.then(function (selectedItem) {
		      $scope.selected = selectedItem;
		    }, function () {
		      $log.info('Modal dismissed at: ' + new Date());
		    });
		  };

		  $scope.toggleAnimation = function () {
		    $scope.animationsEnabled = !$scope.animationsEnabled;
		  };
		// Find existing customer
		/*$scope.findOne = function() {
			$scope.customer = Customers.get({
				//customerId: $stateParams.customerId
				firstName :'KAvin'
			});

		};*/
	}
]);
