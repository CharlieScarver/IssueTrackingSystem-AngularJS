'use strict';

angular.module('issueTrackingSystem.logout', [
		'issueTrackingSystem.users.authentication'
	])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/logout', {
			templateUrl: 'views/logout.html',
			controller: 'LogoutController'
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
