'use strict';

angular.module('issueTrackingSystem.projects.projectPage', [
		'issueTrackingSystem.users.identity',
		'issueTrackingSystem.projects.getProject'
	])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/projects/:id', {
			templateUrl: 'views/project-page.html',
			controller: 'ProjectPageController'
		})
	}])	
	.controller('ProjectPageController', [
		'$scope',
		'$route',
		'identity',
		'getProject',
		function ProjectPageController($scope, $route, 
			identity, getProject) {

			var projectId = $route.current.pathParams['id'];
			
			getProject.getProjectById(projectId)
				.then(function (projectData) {
					$scope.project = projectData;
					console.log(projectData);
				});

		}]);