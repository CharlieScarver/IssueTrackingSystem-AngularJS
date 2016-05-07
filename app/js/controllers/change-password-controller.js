'use strict';

angular.module('issueTrackingSystem.users.changePasswordPage', [
		'issueTrackingSystem.users.changeUserPassword',
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

		$routeProvider.when('/profile/password', {
			templateUrl: 'views/change-password.html',
			controller: 'ChangePasswordController',
			resolve: routeChecks.authenticated
		})
	}])	
	.controller('ChangePasswordController', [
		'$scope',
		'$location',
		'changeUserPassword',
		function ChangePasswordController($scope, $location, changeUserPassword) {
		
			$scope.changePassword = function (user) {
				changeUserPassword.changePassword(user)
					.then(function () {
						$location.path('/');					
						toastr.success('You successfully changed your password.');
					});
			};

		}]);