'use strict';

angular.module('issueTrackingSystem.issues.getIssue', [])
	.factory('getIssue', [
		'$http', 
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
		
			function getIssueById(issueId) {
				var deferred = $q.defer();

				$http.get(BASE_URL + 'Issues/' + issueId)
					.then(function (response) {
						deferred.resolve(response.data);
					});

				return deferred.promise;
			}	

			return {
				getIssueById: getIssueById
			}
		}])