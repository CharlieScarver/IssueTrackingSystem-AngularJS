'use strict';

angular.module('issueTrackingSystem.issues.issuePage', [
		'issueTrackingSystem.users.identity',
		'issueTrackingSystem.issues.getIssue',
		'issueTrackingSystem.projects.getProject',
		'issueTrackingSystem.issues.changeIssueStatus'
	])
	.config(['$routeProvider', function ($routeProvider) {
		var routeChecks = {
			authenticated: ['$q', 'authentication', function ($q, authentication) {
				if (authentication.isAuthenticated()) {
					return $q.when(true);
				}

				return $q.reject('Unauthorized Access');
			}]
		};

		$routeProvider.when('/issues/:id', {
			templateUrl: 'views/issue-page.html',
			controller: 'IssuePageController',
			resolve: routeChecks.authenticated
		})
	}])	
	.controller('IssuePageController', [
		'$scope',
		'$route',
		'identity',
		'getIssue',
		'getProject',
		'changeIssueStatus',
		function IssuePageController($scope, $route, 
			identity, getIssue, getProject, changeIssueStatus) {

			var issueId = $route.current.pathParams['id'];

			$scope.changeIssueStatus = function(statusId, statusName) {
				changeIssueStatus.changeStatus(issueId, statusId)
					.then(function (newStatusesArr) {
						$scope.issue.AvailableStatuses = newStatusesArr;
						$scope.issue.Status = {
							Id: statusId,
							Name: statusName
						};
					});
			};
			
			getIssue.getIssueById(issueId)
				.then(function (issueData) {
					$scope.issue = issueData;

					getProject.getProjectById(issueData.Project.Id)
						.then(function (projectData) {							

							identity.getCurrentUser()
								.then(function (user) {
									$scope.currentUser = user;
									if (user.Id === projectData.Lead.Id || user.isAdmin) {
										$scope.isProjectLeader = true;
									}

									if (user.Id === issueData.Assignee.Id) {
										$scope.isAssignee = true;
									}
								});
						});					
				});

		}]);