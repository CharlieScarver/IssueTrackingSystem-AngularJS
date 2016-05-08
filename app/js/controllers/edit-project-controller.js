'use strict';

angular.module('issueTrackingSystem.projects.editProjectPage', [
		'issueTrackingSystem.users.authorization',
		'issueTrackingSystem.users.identity',
		'issueTrackingSystem.users.getUser',
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
		'toastr',
		'identity',
		'getUser',
		'getProject',
		'editProject',
		function EditProjectPageController($scope, $route, $location,
			toastr, identity, getUser, getProject, editProject) {

			var projectId = $route.current.pathParams['id'];

			$scope.editProject = function (project) {
				getUser.getUserByUsername(project.Lead.Username)
					.then(function (userArray) {
						if (userArray.length > 0) {
							project.Lead = userArray[0];

							editProject.editProject(projectId, project)
								.then(function (editedProject) {
									$location.path('/projects/' + projectId);
									toastr.success('Project "' + editedProject.Name + '" was edited successfully');
								});
						} else {							
							toastr.error('User "' + project.Lead.Username + '" doesn\'t exist!');
						}
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
							if (user.Id === projectData.Lead.Id) {
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

		}]);