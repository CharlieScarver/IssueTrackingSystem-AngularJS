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
						+ '&DueDate=' + $('#datepicker').val();//new Date(issue.date).toISOString()
						// ngModel can't take date value from datepicker

				if (issue.labels) {
					var re = /,\s*/g,
						labelList = issue.labels.split(re);			

					for (var i = 0, len = labelList.length; i < len; i++) {
						if (labelList[i] !== "") {
							issueData += '&Labels[' + i + '].Name=' + labelList[i];
						}
					}
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