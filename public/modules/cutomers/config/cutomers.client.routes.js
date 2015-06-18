'use strict';

//Setting up route
angular.module('cutomers').config(['$stateProvider',
	function($stateProvider) {
		// Cutomers state routing
		$stateProvider.
		state('listCutomers', {
			url: '/cutomers',
			templateUrl: 'modules/cutomers/views/list-cutomers.client.view.html'
		}).
		state('createCutomer', {
			url: '/cutomers/create',
			templateUrl: 'modules/cutomers/views/create-cutomer.client.view.html'
		}).
		state('viewCutomer', {
			url: '/cutomers/:cutomerId',
			templateUrl: 'modules/cutomers/views/view-cutomer.client.view.html'
		}).
		state('editCutomer', {
			url: '/cutomers/:cutomerId/edit',
			templateUrl: 'modules/cutomers/views/edit-cutomer.client.view.html'
		});
	}
]);
