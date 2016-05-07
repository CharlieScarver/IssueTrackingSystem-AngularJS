'use strict';

angular.module('issueTrackingSystem.projects.allProjects', [
		'issueTrackingSystem.users.identity',
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

		$routeProvider.when('/projects', {
			templateUrl: 'views/all-projects.html',
			controller: 'AllProjectsController',
			resolve: routeChecks
		})
	}])	
	.controller('AllProjectsController', [
		'$scope',
		'$location',
		'$timeout',
		'identity',
		'getProjects',
		'toastr',
		function AllProjectsController($scope, $location, $timeout,
			identity, getProjects, toastr) {

			function changeActiveProjectPageButton(page) {
				$('.project-page-btn').removeClass('btn-success');
				$('#ppb-' + page).addClass('btn-success');
			}

			identity.getCurrentUser()
				.then(function (user) {
					if (!user.isAdmin) {
						$location.path('/');
						toastr.error();
					} else {							
						$scope.currentUser = user;
						$scope.isAdmin = user.isAdmin;
					}
				});
	
			$scope.currentProjectPage = 1;

			$scope.getProjectsPage = function (page) {

					if (page !== $scope.currentProjectPage) {
						getProjects.getProjectsPage(page, 10)
								.then(function(issuesData){
									$scope.projects = issuesData.Projects;
									$scope.totalProjectsPages = issuesData.TotalPages;
									$scope.currentProjectPage = page;
								});

						changeActiveProjectPageButton(page);
					}
				};	

			getProjects.getProjectsPage($scope.currentProjectPage, 10)
				.then(function (projectsData) {
					$scope.projects = projectsData.Projects;
					$scope.totalProjectsPages = projectsData.TotalPages;	

					$timeout(function () {
						changeActiveProjectPageButton($scope.currentProjectPage);
					}, 0);
				});

		}]);