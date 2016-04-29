'use strict';

angular.module('issueTrackingSystem.home', [
		'issueTrackingSystem.users.authentication'
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
		function HomeController($scope, $route, authentication) {
			$scope.login = function (user) {
				authentication.loginUser(user)
					.then(function (loggedInUser) {
						$scope.isAuthenticated = true;
					});
			};

			$scope.register = function (user) {
				authentication.registerUser(user)
					.then(function(registeredUser) {
						$scope.isAuthenticated = true;
					});
			};
		}]);
