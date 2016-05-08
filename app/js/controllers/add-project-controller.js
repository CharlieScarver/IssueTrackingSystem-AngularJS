'use strict';

angular.module('issueTrackingSystem.projects.addProjectPage', [
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

		$routeProvider.when('/projects/add', {
			templateUrl: 'views/add-project.html',
			controller: 'AddProjectPageController',
			resolve: routeChecks.authenticated
		})
	}])	
	.controller('AddProjectPageController', [
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
		function AddProjectPageController($scope, $route, $location, 
			$rootScope, $timeout, identity, userLeadProjects, getAllUsers, 
			getAllLabels, addIssue, getProject, getProjects, toastr) {


			identity.getCurrentUser()
				.then(function (user) {
					if (!user.isAdmin) {
						$location.path('/');
						toastr.error('Unauthorized Access');
					} else {							
						$scope.currentUser = user;
						$scope.isAdmin = user.isAdmin;
					}
				});	


		}]);