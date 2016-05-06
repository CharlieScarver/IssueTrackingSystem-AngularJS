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
					issueData = 'Title=' + issue.title 
						+ '&Description=' + issue.description
						+ '&ProjectId=' + issue.projectId
						+ '&AssigneeId=' + issue.assigneeId
						+ '&PriorityId=' + issue.priorityId
						+ '&DueDate=' + $('#datepicker').val()//issue.date//new Date(issue.date).toISOString()
						+ '&Labels[0].Name=' + issue.label;
						// TODO: ngModel can't take date value from datepicker
						
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