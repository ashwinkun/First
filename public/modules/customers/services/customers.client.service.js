'use strict';

//customers service used to communicate customers REST endpoints
angular.module('customers').factory('Customers', ['$resource',
	function($resource) {
		return $resource('customers/:customerId', { customerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
