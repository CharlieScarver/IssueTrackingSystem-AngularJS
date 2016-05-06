'use strict';

angular.module('issueTrackingSystem.issues.issuePage', [
		'issueTrackingSystem.users.identity',
		'issueTrackingSystem.issues.getIssue'
	])
	.config(['$routeProvider', function ($routeProvider) {
		var routeChecks = {
			authenticated: ['$q', 'authentication', function ($q, authentication) {
				if (authentication.isAuthenticated()) {
					return $q.when(true);
				}

				return $q.reject('Unauthorized Access');
			}]
		};

		$routeProvider.when('/issues/:id', {
			templateUrl: 'views/issue-page.html',
			controller: 'IssuePageController',
			resolve: routeChecks.authenticated
		})
	}])	
	.controller('IssuePageController', [
		'$scope',
		'$route',
		'identity',
		'getIssue',
		function IssuePageController($scope, $route, 
			identity, getIssue) {

			var issueId = $route.current.pathParams['id'];
			
			getIssue.getIssueById(issueId)
				.then(function (issueData) {
					$scope.issue = issueData;
				});

		}]);