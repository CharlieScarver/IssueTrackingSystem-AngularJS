'use strict';

angular.module('issueTrackingSystem.projects.addIssue', [])
	.factory('addIssue', [
		'$http', 
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
		
			function addIssue(issue) {
				var deferred = $q.defer();
				var request,
					issueData = 'Title=' + issue.Name 
					+ '&Description=' + issue.Description 
					+ '&DueDate=' + issue.DueDate
					+ '&AssigneeId=' + issue.AssigneeId;

				for (var i = 0, len = project.Labels; i < len; i++) {
					issueData += '&Labels[' + i + '].Name' + project.Labels.Name;
				}

				for (var i = 0, len = project.Priorities; i < len; i++) {
					issueData += '&Priorities[' + i + '].Name' + project.Priorities.Name;
				}
					
				request = {
				    method: 'POST',
				    url: BASE_URL + 'Issues/',
				    data: issueData,
				    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
				};

				$http(request)
					.then(function (response) {
						deferred.resolve(response.data);
					});

				return deferred.promise;
			}			

			return {
				addIssue: addIssue
			}
		}])