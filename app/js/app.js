'use strict';

angular.module('issueTrackingSystem', [
		'ngRoute',
		'ngCookies',
		'issueTrackingSystem.home'
	])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.otherwise({redirectTo: '/'});
	}])
	.run(['authentication', function (authentication) {
		authentication.refreshCookie();
	}])
	.constant('BASE_URL','http://softuni-issue-tracker.azurewebsites.net/');
