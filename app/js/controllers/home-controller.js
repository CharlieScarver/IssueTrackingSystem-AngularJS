'use strict';

angular.module('issueTrackingSystem.home', [
		//'ui.bootstrap',
		'issueTrackingSystem.users.authentication',
		'issueTrackingSystem.users.identity',
		'issueTrackingSystem.users.userIssues',
		'issueTrackingSystem.users.userLeadProjects',
		'issueTrackingSystem.filters.range'		
	])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'views/home.html',
			controller: 'HomeController'
		})
	}])	
	.controller('HomeController', [
		'$scope',
		'$route',
		'authentication',
		'identity',
		'userIssues',
		'userLeadProjects',
		function HomeController($scope, $route, authentication, 
			identity, userIssues, userLeadProjects) {
			var affiliatedProjects = [],
				totalIssuePages,
				currentIssuePage = 1,
				totalProjectsPages,
				currentProjectPage = 1;

			$scope.isAuthenticated = authentication.isAuthenticated();

			$scope.login = function (user) {
				authentication.loginUser(user)
					.then(function () {
						$route.reload();
					});
			};

			$scope.register = function (user) {
				authentication.registerUser(user)
					.then(function() {
						$route.reload();
					});
			};

			$scope.getIssuesPage = function (page) {
				userIssues.getUserIssues(page)
						.then(function(issuesData){
							$scope.userIssues = issuesData.Issues;
							$scope.totalIssuePages = issuesData.TotalPages;
							$scope.currentIssuePage = page;
						});
			};

			$scope.getProjectsPage = function (page) {
				userLeadProjects.getUserLeadProjects($scope.currentUser.Username, page)
						.then(function(issuesData){
							$scope.affiliatedProjects = issuesData.Projects;
							$scope.totalProjectsPages = issuesData.TotalPages;
							$scope.currentProjectPage = page;
						});
			};


			// get current user
			identity.getCurrentUser()
				.then(function (user) {
					$scope.currentUser = user;
					$scope.isAuthenticated = true;
					console.log(user);

					// get issues
					userIssues.getUserIssues(1)
						.then(function(issuesData){
							$scope.userIssues = issuesData.Issues;
							$scope.totalIssuePages = issuesData.TotalPages;					

							// add issue projects to affiliated projects
							$scope.userIssues.forEach(function(el) {
								if (el) {
									//affiliatedProjects.push(el.Project);
								}
							});

							// get projects where user is leader
							userLeadProjects.getUserLeadProjects(user.Username, 1)
								.then(function (projectsData) {
									$scope.totalProjectsPages = projectsData.TotalPages;	

									// add them to affiliated projects
									projectsData.Projects.forEach(function(el) {
										if (el) {
											affiliatedProjects.push(el);
										}
									});

									$scope.affiliatedProjects = affiliatedProjects;
									console.log($scope.affiliatedProjects);

								});																		
						});
					
				});
		}]);
