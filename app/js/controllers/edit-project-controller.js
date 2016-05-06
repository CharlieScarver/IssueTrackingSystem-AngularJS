'use strict';

angular.module('issueTrackingSystem.projects.editProjectPage', [
		'issueTrackingSystem.users.identity',
		'issueTrackingSystem.users.getUser',
		'issueTrackingSystem.projects.getProject',
		'issueTrackingSystem.projects.editProject'
	])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/projects/:id/edit', {
			templateUrl: 'views/edit-project.html',
			controller: 'EditProjectPageController'
		})
	}])
	// TODO: Check if user can access this path
	.controller('EditProjectPageController', [
		'$scope',
		'$route',
		'$location',
		'identity',
		'getUser',
		'getProject',
		'editProject',
		function EditProjectPageController($scope, $route, $location,
			identity, getUser, getProject, editProject) {

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
							//toastr.err
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
							}
							console.log(user);
						});
				});

		}]);