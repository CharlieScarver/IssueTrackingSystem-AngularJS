'use strict';

angular.module('socialNetwork.users.identity', [])
	.factory('identity', [
		'$http',
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
			var deferred = $q.defer(),
				currentUser = undefined;

			return {
				getCurrentUser: function () {
					// chaka nqkoi da napravi zaqvka za user-a
					if (currentUser) {
						// ako ima user go vrushta
						return $q.when(currentUser); // returns a promise + resolved data
					} else {
						// ako ne vrushta promise che nqkoga shte go ima
						return deferred.promise;
					}
				},
				removeUserProfile: function () {
					currentUser = undefined;
				},
				requestUserProfile: function () {
					var userProfileDeferred = $q.defer();

					$http.get(BASE_URL + 'me')
						.then(function (response) {
							currentUser = response.data;
							deferred.resolve(currentUser);
							userProfileDeferred.resolve(currentUser);
						});

					return userProfileDeferred.promise;
				}
			};
	}])
