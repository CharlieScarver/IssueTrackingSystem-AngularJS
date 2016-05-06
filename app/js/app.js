'use strict';

angular.module('issueTrackingSystem', [
		'ngRoute',
		'ngCookies',
		'issueTrackingSystem.common',
		'issueTrackingSystem.home',
		'issueTrackingSystem.logout',
		'issueTrackingSystem.projects.projectPage',
		'issueTrackingSystem.issues.issuePage',
		'issueTrackingSystem.projects.editProjectPage'
	])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.otherwise({redirectTo: '/'});
	}])
	.run(['authentication', function (authentication) {
		authentication.refreshCookie();
	}])
	.constant('BASE_URL','http://softuni-issue-tracker.azurewebsites.net/');
