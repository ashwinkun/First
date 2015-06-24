'use strict';

// Configuring the Articles module
angular.module('customers').run(['Menus',
	function(Menus) {
		// Set top bar menu items

	   Menus.addMenuItem('topbar', 'customers', 'customers', 'dropdown', '/customers(/create)?');
	  	Menus.addSubMenuItem('topbar', 'customers', 'List customers', 'customers');
  		Menus.addSubMenuItem('topbar', 'customers', 'New customer', 'customers/create');

	}
]);
