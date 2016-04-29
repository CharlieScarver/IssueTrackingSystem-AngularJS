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
		}]);
