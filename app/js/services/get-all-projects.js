'use strict';

angular.module('issueTrackingSystem.projects.getProjects', [])
	.factory('getProjects', [
		'$http', 
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
		
			function getProjectsPage(currentPage, pageSize) {
				var deferred = $q.defer();

				pageSize = pageSize || 10;
				currentPage = currentPage || 1;

				$http.get(BASE_URL + 'Projects?filter=&pageSize=' 
					+ pageSize + '&pageNumber=' + currentPage)
					.then(function (response) {
						deferred.resolve(response.data);
					});

				return deferred.promise;	
			}		

			return {
				getProjectsPage: getProjectsPage
			}
		}])