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
		'$location',
		'authentication',
		function LogoutController($scope, $location, authentication) {

			$scope.logout = function () {
				authentication.logout();
				$location.path('/');
				// TODO: toastr
			}

		}]);
