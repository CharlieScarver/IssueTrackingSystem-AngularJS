'use strict';

angular.module('issueTrackingSystem.projects.editProjectPage', [
		'issueTrackingSystem.users.authorization',
		'issueTrackingSystem.users.identity',
		'issueTrackingSystem.users.getUser',
		'issueTrackingSystem.users.getAllUsers',
		'issueTrackingSystem.projects.getProject',
		'issueTrackingSystem.projects.editProject'
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

		$routeProvider.when('/projects/:id/edit', {
			templateUrl: 'views/edit-project.html',
			controller: 'EditProjectPageController',
			resolve: routeChecks.authenticated
		})
	}])
	.controller('EditProjectPageController', [
		'$scope',
		'$route',
		'$location',
		'$timeout',
		'identity',
		'getUser',
		'getAllUsers',
		'getProject',
		'editProject',
		'toastr',
		function EditProjectPageController($scope, $route, $location, $timeout,
			identity, getUser, getAllUsers, getProject, editProject, toastr) {

			var projectId = $route.current.pathParams['id'];

			$scope.editProject = function (project) {
				editProject.editProject(projectId, project)
					.then(function (editedProject) {
						$location.path('/projects/' + projectId);
						toastr.success('Project "' + editedProject.Name + '" was edited successfully');
					});	
			};
			
			getProject.getProjectById(projectId)
				.then(function (projectData) {
					$scope.project = projectData;

					var commaSepPriorities = "",
						commaSepLabels = "";

					// make Priorities string
					projectData.Priorities.forEach(function (el) {
						commaSepPriorities += el.Name + ', ';
					});					
					$scope.project.priorities = commaSepPriorities;

					// make Labels string
					projectData.Labels.forEach(function (el) {
						commaSepLabels += el.Name + ', ';
					});		
					$scope.project.labels = commaSepLabels;

					identity.getCurrentUser()
						.then(function (user) {
							$scope.currentUser = user;
							if (user.Id === projectData.Lead.Id || user.isAdmin) {
								$scope.isProjectLeader = true;
							} else {
								$location.path('/');
								toastr.error("Unauthorized Access!");								
							}
						});

					getProject.getProjectIssues(projectData.Id)
						.then(function (issues) {
							$scope.project.Issues = issues;
						});
				});

			getAllUsers.getAllUsers()
				.then(function (usersData) {
					$scope.users = usersData;

					$timeout(function () {
						var userOption = $("select option[value='" + $scope.project.Lead.Id + "']");
						userOption.attr("selected","selected");
					}, 10);

				});

		}]);