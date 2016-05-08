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

				if (project.priorities) {
					var re = /,\s*/g,
						prioritiesList = project.priorities.split(re);			

					for (var i = 0, len = prioritiesList.length; i < len; i++) {
						if (prioritiesList[i] !== "") {
							projectData += '&Priorities[' + i + '].Name=' + prioritiesList[i];
						}
					}
				}

				if (project.labels) {
					var re = /,\s*/g,
						labelList = project.labels.split(re);			

					for (var i = 0, len = labelList.length; i < len; i++) {
						if (labelList[i] !== "") {
							projectData += '&Labels[' + i + '].Name=' + labelList[i];
						}
					}
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