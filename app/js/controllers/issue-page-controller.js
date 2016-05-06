'use strict';

angular.module('issueTrackingSystem.issues.issuePage', [
		'issueTrackingSystem.users.identity',
		'issueTrackingSystem.issues.getIssue'
	])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/issues/:id', {
			templateUrl: 'views/issue-page.html',
			controller: 'IssuePageController'
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
					console.log(issueData);
				});

		}]);