'use strict';

angular.module('issueTrackingSystem.projects.getProject', [])
	.factory('getProject', [
		'$http', 
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
		
			function getProjectIssues(projectId) {
				var deferred = $q.defer();

				$http.get(BASE_URL + 'Projects/' + projectId + '/issues')
					.then(function (response) {
						deferred.resolve(response.data);
					});

				return deferred.promise;
			}

			function getProjectById(projectId) {
				var deferred = $q.defer();

				$http.get(BASE_URL + 'Projects/' + projectId)
					.then(function (response) {
						deferred.resolve(response.data);
					});

				return deferred.promise;	
			}			

			return {
				getProjectById: getProjectById,
				getProjectIssues: getProjectIssues
			}
		}])