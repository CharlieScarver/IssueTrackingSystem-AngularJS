'use strict';

angular.module('issueTrackingSystem.home', [
		'issueTrackingSystem.users.authentication',
		'issueTrackingSystem.users.identity',
		'issueTrackingSystem.users.userIssues',
		'issueTrackingSystem.users.userLeadProjects'
	])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'views/home.html',
			controller: 'HomeController'
		})
	}])
	.controller('HomeController', [
		'$scope',
		'$route',
		'authentication',
		'identity',
		'userIssues',
		'userLeadProjects',
		function HomeController($scope, $route, authentication, identity, userIssues, userLeadProjects) {
			$scope.isAuthenticated = authentication.isAuthenticated();

			$scope.login = function (user) {
				authentication.loginUser(user)
					.then(function () {
						$route.reload();
					});
			};

			$scope.register = function (user) {
				authentication.registerUser(user)
					.then(function() {
						$route.reload();
					});
			};

			$scope.logout = function () {
				authentication.logout();
				$scope.isAuthenticated = false;
				$route.reload();
			};

			identity.getCurrentUser()
				.then(function (user) {
					$scope.currentUser = user;
					$scope.isAuthenticated = true;
					console.log(user);
				});

			var issuesInfo;

			userIssues.getUserIssues()
				.then(function(issuesData){
					issuesInfo = issuesData;
					$scope.userIssues = issuesData.Issues;					
				});

		}]);
