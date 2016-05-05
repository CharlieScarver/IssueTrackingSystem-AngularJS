'use strict';

angular.module('issueTrackingSystem.users.userLeadProjects', [])
	.factory('userLeadProjects', [
		'$http', 
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
		
			function getUserLeadProjects(username, currentPage) {
				var deferred = $q.defer();

				var pageSize = 4;
				currentPage = currentPage || 1;

				$http.get(BASE_URL + 'Projects?filter=Lead.Username="' + username + '"&pageSize=' 
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