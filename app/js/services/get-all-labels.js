'use strict';

angular.module('issueTrackingSystem.labels.getAllLabels', [])
	.factory('getAllLabels', [
		'$http', 
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
		
			function getAllLabels() {
				var deferred = $q.defer();

				$http.get(BASE_URL + 'Labels?filter=')
					.then(function (response) {
						deferred.resolve(response.data);
					});

				return deferred.promise;
			}			

			return {
				getAllLabels: getAllLabels
			}
		}])