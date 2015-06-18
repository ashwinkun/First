'use strict';

// Cutomers controller
angular.module('cutomers').controller('CutomersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cutomers',
	function($scope, $stateParams, $location, Authentication, Cutomers) {
		$scope.authentication = Authentication;

		// Create new Cutomer
		$scope.create = function() {
			// Create new Cutomer object
			var cutomer = new Cutomers ({
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
			cutomer.$save(function(response) {
				$location.path('cutomers/' + response._id);

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

		// Remove existing Cutomer
		$scope.remove = function(cutomer) {
			if ( cutomer ) {
				cutomer.$remove();

				for (var i in $scope.cutomers) {
					if ($scope.cutomers [i] === cutomer) {
						$scope.cutomers.splice(i, 1);
					}
				}
			} else {
				$scope.cutomer.$remove(function() {
					$location.path('cutomers');
				});
			}
		};

		// Update existing Cutomer
		$scope.update = function() {
			var cutomer = $scope.cutomer;

			cutomer.$update(function() {
				$location.path('cutomers/' + cutomer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Cutomers
		$scope.find = function() {
			$scope.cutomers = Cutomers.query();
		};

		// Find existing Cutomer
		$scope.findOne = function() {
			$scope.cutomer = Cutomers.get({
				cutomerId: $stateParams.cutomerId
			});
		};
	}
]);
