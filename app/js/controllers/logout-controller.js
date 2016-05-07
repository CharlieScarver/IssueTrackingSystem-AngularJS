'use strict';

angular.module('issueTrackingSystem.users.logout', [
		'issueTrackingSystem.users.authentication'
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

		$routeProvider.when('/logout', {
			templateUrl: 'views/logout.html',
			controller: 'LogoutController',
			resolve: routeChecks.authenticated
		})
	}])	
	.controller('LogoutController', [
		'$scope',
		'$rootScope',
		'$location',
		'authentication',
		function LogoutController($scope, $rootScope, $location, authentication) {

			$scope.logout = function () {
				authentication.logout();
				$rootScope.__isAuthenticated = false;
				$location.path('/');
				toastr.success('You successfully logged out.');
			};

			$scope.logout();
		}]);
