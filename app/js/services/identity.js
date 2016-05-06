'use strict';

angular.module('issueTrackingSystem.users.identity', [])
	.factory('identity', [
		'$http',
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
			var deferred = $q.defer(),
				currentUser = undefined;

			return {
				getCurrentUser: function () {
					if (currentUser) {
						return $q.when(currentUser);
					} else {
						return deferred.promise;
					}
				},
				removeUserProfile: function () {
					currentUser = undefined;
				},
				requestUserProfile: function () {
					var userProfileDeferred = $q.defer();

					$http.get(BASE_URL + 'users/me')
						.then(function (response) {
							currentUser = response.data;
							deferred.resolve(currentUser);
							userProfileDeferred.resolve(currentUser);
						});

					return userProfileDeferred.promise;
				}
			};
	}])
