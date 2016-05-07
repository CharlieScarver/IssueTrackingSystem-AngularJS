'use strict';

angular.module('issueTrackingSystem.issues.changeIssueStatus', [])
	.factory('changeIssueStatus', [
		'$http', 
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
		
			function changeStatus(issueId, statusId) {
				var deferred = $q.defer();

				$http.put(BASE_URL + 'Issues/' + issueId 
					+ '/changestatus?statusid=' + statusId, null)
					.then(function (response) {
						deferred.resolve(response.data);
					});

				return deferred.promise;
			}	

			return {
				changeStatus: changeStatus
			}
		}])