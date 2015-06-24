'use strict';

//Setting up route
angular.module('customers').config(['$stateProvider',
	function($stateProvider) {
		// customers state routing
		$stateProvider.
		state('listcustomers', {
			url: '/customers',
			templateUrl: 'modules/customers/views/list-customers.client.view.html'
		}).
		state('createcustomer', {
			url: '/customers/create',
			templateUrl: 'modules/customers/views/create-customer.client.view.html'
		}).
		state('viewcustomer', {
			url: '/customers/:customerId',
			templateUrl: 'modules/customers/views/view-customer.client.view.html'
		}).
		state('editcustomer', {
			url: '/customers/:customerId/edit',
			templateUrl: 'modules/customers/views/edit-customer.client.view.html'
		});
	}
]);
