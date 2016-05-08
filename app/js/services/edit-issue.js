'use strict';

angular.module('issueTrackingSystem.issues.editIssue', [])
	.factory('editIssue', [
		'$http', 
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
		
			function editIssue(issue) {
				var deferred = $q.defer();
				var request,
					issueData = 'Title=' + issue.Title 
						+ '&Description=' + issue.Description
						+ '&ProjectId=' + issue.Project.Id
						+ '&AssigneeId=' + issue.assigneeId
						+ '&PriorityId=' + issue.priorityId
						+ '&DueDate=' + $('#datepicker').val();
						// TODO: ngModel can't take date value from datepicker

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
				    method: 'PUT',
				    url: BASE_URL + 'Issues/' + issue.Id,
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
				editIssue: editIssue
			}
		}])