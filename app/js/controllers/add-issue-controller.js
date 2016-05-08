'use strict';

angular.module('issueTrackingSystem.projects.addIssuePage', [
		'issueTrackingSystem.users.authorization',
		'issueTrackingSystem.users.identity',
		'issueTrackingSystem.projects.userLeadProjects',
		'issueTrackingSystem.users.getAllUsers',
		'issueTrackingSystem.labels.getAllLabels',
		'issueTrackingSystem.projects.addIssue',
		'issueTrackingSystem.projects.getProject',		
		'issueTrackingSystem.projects.getProjects'
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

		$routeProvider.when('/projects/:id/add-issue', {
			templateUrl: 'views/add-issue.html',
			controller: 'AddIssuePageController',
			resolve: routeChecks.authenticated
		})
	}])	
	.controller('AddIssuePageController', [
		'$scope',
		'$route',
		'$location',
		'$rootScope',
		'$timeout',
		'identity',
		'userLeadProjects',
		'getAllUsers',
		'getAllLabels',
		'addIssue',
		'getProject',
		'getProjects',
		'toastr',
		function AddIssuePageController($scope, $route, $location, 
			$rootScope, $timeout, identity, userLeadProjects, getAllUsers, 
			getAllLabels, addIssue, getProject, getProjects, toastr) {

			var projectId = $route.current.pathParams['id'];

			$scope.issue = {};		
			
			$scope.createIssue = function (issue) {
				addIssue.addIssue(issue)
					.then(function (createdIssue) {
						$location.path('/projects/' + issue.projectId);
						toastr.success('Issue "' + createdIssue.Title + '" was created successfully');						
					});	
			};

			$scope.loadPriorities = function (projectId) {							
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

			identity.getCurrentUser()
				.then(function (user) {
					$scope.currentUser = user;
					$scope.isAuthenticated = true;

					getProject.getProjectById(projectId)
						.then(function (project) {
							if ((user.Id !== project.Lead.Id) && !user.isAdmin) {
								$location.path('/');
								toastr.error('Unauthorized Access');
							} else {
								$scope.issue.projectId = project.Id;
								// to use later in $timeout						
							}						
						});

					if (user.isAdmin) {
						// get All projects
						getProjects.getProjectsPage(1, 10000)
							.then(function (projectsData) {
								$scope.projects = projectsData.Projects;
							});

					} else {
						// get projects where the user is Leader
						userLeadProjects.getUserLeadProjects(user.Id, 1, 10000)
							.then(function (projectsData){
								$scope.projects = projectsData.Projects;

								$timeout(function(){
									var projectOption = 
										$("select option[value='" + $scope.issue.projectId + "']");
									projectOption.attr("selected","selected");
									$scope.issue.projectId = projectOption.val();
									$scope.loadPriorities($scope.issue.projectId);
								}, 30);	
							});
					}
					
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


				$( "#datepicker" ).datepicker({
					dateFormat: "yy/mm/dd"
				});				
		}]);