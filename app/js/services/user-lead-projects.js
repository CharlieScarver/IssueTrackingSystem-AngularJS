'use strict';

angular.module('issueTrackingSystem.projects.userLeadProjects', [])
	.factory('userLeadProjects', [
		'$http', 
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
		
			function getUserLeadProjects(userId, currentPage) {
				var deferred = $q.defer();

				var pageSize = 4;
				currentPage = currentPage || 1;

				$http.get(BASE_URL + 'Projects?filter=Lead.Id="' + userId + '"&pageSize=' 
					+ pageSize + '&pageNumber=' + currentPage)
					.then(function (response) {
						deferred.resolve(response.data);
					});

				return deferred.promise;	
			}

			return {
				getUserLeadProjects: getUserLeadProjects
			}
		}])