'use strict';

angular.module('issueTrackingSystem.projects.editProjectPage', [
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
			}]/*,
			isProjectLeader: ['$q', '$route', 'identity', 'getProject', 
				function ($q, $route, identity, getProject) {

					var projectId = $route.current.pathParams['id'];
					getProject.getProjectById(projectId)
						.then(function (projectData) {

							identity.getCurrentUser()
								.then(function (user) {
									console.log(user.Id + ' '+ projectData.Lead.Id);
									if (user.Id.toString() === projectData.Lead.Id.toString()) {
										return $q.when(true);
									}

									return $q.reject('Unauthorized Access');
								});
						});					
				}]*/
		};

		$routeProvider.when('/projects/:id/edit', {
			templateUrl: 'views/edit-project.html',
			controller: 'EditProjectPageController',
			resolve: routeChecks
		})
	}])
	// TODO: Check if user can access this path
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
								.then(function (edited) {
									$location.path('/projects/' + projectId);
								});
						} else {							
							toastr.error('User "' + project.Lead.Username + '" doesn\'t exist!');
						}
					});				
			};
			
			getProject.getProjectById(projectId)
				.then(function (projectData) {
					$scope.project = projectData;

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