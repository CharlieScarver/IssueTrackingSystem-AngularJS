'use strict';

angular.module('issueTrackingSystem.issues.editIssuePage', [
		'issueTrackingSystem.users.authorization',
		'issueTrackingSystem.users.identity',
		'issueTrackingSystem.users.getAllUsers',
		'issueTrackingSystem.issues.getIssue',		
		'issueTrackingSystem.issues.changeIssueStatus',
		'issueTrackingSystem.issues.editIssue',
		'issueTrackingSystem.projects.getProject',
		'issueTrackingSystem.projects.userLeadProjects',
		'issueTrackingSystem.labels.getAllLabels'
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

		$routeProvider.when('/issues/:id/edit', {
			templateUrl: 'views/edit-issue.html',
			controller: 'EditIssuePageController',
			resolve: routeChecks.authenticated
		})
	}])	
	.controller('EditIssuePageController', [
		'$scope',
		'$route',
		'$timeout',
		'$location',
		'identity',
		'getIssue',
		'getProject',
		'userLeadProjects',
		'getAllUsers',
		'getAllLabels',
		'changeIssueStatus',
		'editIssue',
		function EditIssuePageController($scope, $route, $timeout, $location, 
			identity, getIssue, getProject, userLeadProjects, getAllUsers, 
			getAllLabels, changeIssueStatus, editIssue) {

			function loadPriorities(projectId) {							
				var priorities = [];

				for (var i = 0, len = $scope.projects.length; i < len; i++) {
					
					if (parseInt($scope.projects[i].Id) === parseInt(projectId)) {
						for (var j = 0, len2 = $scope.projects[i].Priorities.length; j < len2; j++) {
							priorities.push($scope.projects[i].Priorities[j]);							
						}
						break;
					}
				}

				$scope.priorities = priorities;
			};

			var issueId = $route.current.pathParams['id'];

			$( "#datepicker" ).datepicker({
				dateFormat: "yy/mm/dd"
			});	

			$scope.editIssue = function (issue) {
				editIssue.editIssue(issue)
					.then(function (editedIssue) {
						$location.path('/issues/' + issue.Id);
						toastr.success('Issue "' + editedIssue.Title + '" was edited successfully');						
					});	
			};		

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

					var commaSepLabels = "";
					issueData.Labels.forEach(function (el) {
						commaSepLabels += el.Name + ', ';
					});

					// for the input				
					$scope.issue.labels = commaSepLabels;

					getProject.getProjectById(issueData.Project.Id)
						.then(function (project) {	
							
							identity.getCurrentUser()
								.then(function (user) {
									$scope.currentUser = user;
									if (user.Id === project.Lead.Id || user.isAdmin) {

										userLeadProjects.getUserLeadProjects(user.Id, 1, 10000)
											.then(function (projectsData){
												$scope.projects = projectsData.Projects;

												// doing this as late as possible because the UI shouble be updated
												$timeout(function(){
													var userOption = $("select option[value='" + user.Id + "']");
													userOption.attr("selected","selected");
													$scope.issue.assigneeId = userOption.val();

													loadPriorities(project.Id);
													$timeout(function(){
														var priorityOption = 
															$("select option[value='" + issueData.Priority.Id + "']");
														priorityOption.attr("selected","selected");
														$scope.issue.priorityId = priorityOption.val();
													}, 0);
												}, 0);
											});

									} else {
										$location.path('/');
										toastr.error('Unauthorized Access');
									}
								});
						});					
				});

			
			getAllUsers.getAllUsers()
				.then(function (usersData) {
					$scope.users = usersData;
				});

			getAllLabels.getAllLabels()
				.then(function (labels) {
					var labelsArr = [];
					labels.forEach(function (el) {
						labelsArr.push(el.Name);
					});

					$scope.labels = labelsArr;

					$scope.complete = function () {
					    $( "#issue-label" ).autocomplete({
					      source: $scope.labels
					    });
				    };
				});

		}]);