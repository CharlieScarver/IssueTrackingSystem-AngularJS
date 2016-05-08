'use strict';

angular.module('issueTrackingSystem.projects.projectPage', [
		'issueTrackingSystem.users.identity',
		'issueTrackingSystem.projects.getProject'
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

		$routeProvider.when('/projects/:id', {
			templateUrl: 'views/project-page.html',
			controller: 'ProjectPageController',
			resolve: routeChecks.authenticated
		})
	}])	
	.controller('ProjectPageController', [
		'$scope',
		'$route',
		'$rootScope',
		'identity',
		'getProject',
		function ProjectPageController($scope, $route, 
			$rootScope, identity, getProject) {

			var projectId = $route.current.pathParams['id'];
			
			getProject.getProjectById(projectId)
				.then(function (projectData) {
					$scope.project = projectData;

					if ($rootScope.__currentUser.Id === projectData.Lead.Id || $rootScope.__currentUser.isAdmin) {
						$scope.isProjectLeader = true;
					}

					getProject.getProjectIssues(projectId)
						.then(function (issues) {
							$scope.project.Issues = issues;
						})	
				});			

		}]);