'use strict';

angular.module('issueTrackingSystem.projects.addIssuePage', [
		'issueTrackingSystem.users.identity',
		'issueTrackingSystem.projects.getProject',
		'issueTrackingSystem.projects.userLeadProjects',
		'issueTrackingSystem.users.getAllUsers',
		'issueTrackingSystem.projects.addIssue'
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
		'identity',
		'getProject',
		'userLeadProjects',
		'getAllUsers',
		'addIssue',
		function AddIssuePageController($scope, $route, identity, getProject, 
			userLeadProjects, getAllUsers, addIssue) {

			var projectId = $route.current.pathParams['id'];
			
			$scope.createIssue = function (issue) {
				//addIssue.addIssue(issue);	
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

					userLeadProjects.getUserLeadProjects(user.Id, 1, 10000)
						.then(function (projectsData){
							$scope.projects = projectsData.Projects;

							getAllUsers.getAllUsers()
								.then(function (usersData) {
									$scope.users = usersData;
								});
						});
				});
			
			

		}]);