'use strict';

angular.module('issueTrackingSystem.common', [
		'issueTrackingSystem.users.authentication',
		'issueTrackingSystem.users.identity'
	])
	.controller('MainController', [
		'$scope',
		'$rootScope',
		'$location',
		'authentication',
		'identity',
		function MainController($scope, $rootScope, $location, authentication, identity) {			
			if ($rootScope.__isAuthenticated) {
				identity.requestUserProfile();
			}
			if (authentication.isAuthenticated()) {
				$rootScope.__isAuthenticated = true;
			}


			$scope.logout = function () {	
				$location.path('/logout');
			};

			$scope.$watch('__isAuthenticated', function() {
				console.log('__isAuth: ' + $rootScope.__isAuthenticated);

				if ($rootScope.__isAuthenticated && authentication.isAuthenticated() && !$rootScope.__currentUser) {
				// if user has logged in and we don't have a user already

					// get the new user
					identity.getCurrentUser()
						.then(function (user) {
							$rootScope.__currentUser = user;
						});
				} else {
					$rootScope.__currentUser = undefined;
				}        
		    });

		}]);
