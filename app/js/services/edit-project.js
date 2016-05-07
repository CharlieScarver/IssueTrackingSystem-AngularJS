'use strict';

angular.module('issueTrackingSystem.projects.editProject', [])
	.factory('editProject', [
		'$http', 
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
		
			function editProject(projectId, project) {
				var deferred = $q.defer();
				var request,
					projectData = 'Name=' + project.Name 
					+ '&Description=' + project.Description 
					+ '&LeadId=' + project.Lead.Id;

				for (var i = 0, len = project.Labels; i < len; i++) {
					projectData += '&Labels[' + i + '].Name' + project.Labels.Name;
				}

				for (var i = 0, len = project.Priorities; i < len; i++) {
					projectData += '&Priorities[' + i + '].Name' + project.Priorities.Name;
				}
				
				request = {
				    method: 'PUT',
				    url: BASE_URL + 'Projects/' + projectId,
				    data: projectData,
				    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
				};

				$http(request)
					.then(function (response) {
						deferred.resolve(response.data);
					});

				return deferred.promise;
			}			

			return {
				editProject: editProject
			}
		}])