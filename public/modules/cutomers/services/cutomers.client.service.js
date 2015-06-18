'use strict';

//Cutomers service used to communicate Cutomers REST endpoints
angular.module('cutomers').factory('Cutomers', ['$resource',
	function($resource) {
		return $resource('cutomers/:cutomerId', { cutomerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);