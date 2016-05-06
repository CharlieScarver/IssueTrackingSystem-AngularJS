'use strict';

angular.module('issueTrackingSystem.issues.userIssues', [
		'issueTrackingSystem.filters.characterLimit'
	])
	.factory('userIssues', [
		'$http', 
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
			
			var totalUserIssuesCount,
				totalPages;

			function getUserIssues(currentPage) {
				var deferred = $q.defer();

				var pageSize = 3;
				currentPage = currentPage || 1;

				$http.get(BASE_URL + 'Issues/me?orderBy=DueDate desc&pageSize=' + pageSize + '&pageNumber=' + currentPage)
					.then(function (response) {
						deferred.resolve(response.data);
					});

				return deferred.promise;	
			}

			return {
				getUserIssues: getUserIssues
			}
		}])