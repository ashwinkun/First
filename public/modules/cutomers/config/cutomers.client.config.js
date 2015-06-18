'use strict';

// Configuring the Articles module
angular.module('cutomers').run(['Menus',
	function(Menus) {
		// Set top bar menu items

	   Menus.addMenuItem('topbar', 'Cutomers', 'cutomers', 'dropdown', '/cutomers(/create)?');
	  	Menus.addSubMenuItem('topbar', 'cutomers', 'List Cutomers', 'cutomers');
  		Menus.addSubMenuItem('topbar', 'cutomers', 'New Cutomer', 'cutomers/create');

	}
]);
