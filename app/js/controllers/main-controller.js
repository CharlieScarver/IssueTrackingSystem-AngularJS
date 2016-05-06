'use strict';

angular.module('issueTrackingSystem.common', [
		'issueTrackingSystem.users.authentication',
		'issueTrackingSystem.users.identity'
	])
	.controller('MainController', [
		'$scope',
		'$rootScope',
		'$location',
		'$route',
		'authentication',
		'identity',
		function MainController($scope, $rootScope, $location, $route, authentication, identity) {			
			if ($rootScope.__isAuthenticated) {
				identity.requestUserProfile();
			}


			$scope.logout = function () {	
				$location.path('/logout');
			};

			$scope.$watch('__isAuthenticated', function() {
				console.log('__isAuth: ' + $rootScope.__isAuthenticated);

				if ($rootScope.__isAuthenticated && authentication.isAuthenticated() && !$scope.currentUser) {
				// if user has logged in and we don't have a user already

					// get the new user
					identity.getCurrentUser()
						.then(function (user) {
							$scope.currentUser = user;
						});
				} else {
					$scope.currentUser = undefined;
				}        
		    });

		}]);
