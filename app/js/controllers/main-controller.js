'use strict';

angular.module('issueTrackingSystem.common', [
		'issueTrackingSystem.users.authentication',
		'issueTrackingSystem.users.identity'
	])
	.controller('MainController', [
		'$scope',
		'$location',
		'$route',
		'authentication',
		'identity',
		function MainController($scope, $location, $route, authentication, identity) {

			$scope.logout = function () {
				$scope.isAuthenticated = false;
				$scope.currentUser = undefined;
				$location.path('/logout');
			};

			identity.getCurrentUser()
				.then(function (user) {
					$scope.currentUser = user;
					$scope.isAuthenticated = true;
					console.log(user);
				});

			if (authentication.isAuthenticated() && !$scope.currentUser) {
				$scope.isAuthenticated = true; // to see navigation
				identity.requestUserProfile();
			}

			// TODO: login/logout/login -> won't show menu, because MainController is not reinitialized

		}]);
