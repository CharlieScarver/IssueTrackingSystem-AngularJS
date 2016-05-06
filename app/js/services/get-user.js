'use strict';

angular.module('issueTrackingSystem.users.getUser', [])
	.factory('getUser', [
		'$http', 
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
		
			function getUserByUsername(username) {
				var deferred = $q.defer();

				$http.get(BASE_URL + 'Users/?filter=Username="' + username +'"')
					.then(function (response) {
						deferred.resolve(response.data);
					});

				return deferred.promise;	
			}			

			return {
				getUserByUsername: getUserByUsername
			}
		}])