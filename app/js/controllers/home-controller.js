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
				currentIssuePage = 1;

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

			$scope.logout = function () {
				authentication.logout();
				$scope.isAuthenticated = false;
				$route.reload();
			};

			$scope.getIssuesPage = function (page) {
				userIssues.getUserIssues(page)
						.then(function(issuesData){
							$scope.userIssues = issuesData.Issues;
							$scope.totalIssuePages = issuesData.TotalPages;
							$scope.currentIssuePage = page;
						});
			}

/*/------------------------------- TODO: REMOVE ui.bootstrap and angular-animate
			$scope.totalItems = 64;
			$scope.currentPage = 4;

			$scope.setPage = function (pageNo) {
				$scope.currentPage = pageNo;
			};

			$scope.pageChanged = function() {
				$log.log('Page changed to: ' + $scope.currentPage);
			};

			$scope.maxSize = 5;
			$scope.bigTotalItems = 175;
			$scope.bigCurrentPage = 1;
//----------------------------------*/

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
								if (el && !affiliatedProjects[el.Project.Name]) {
									affiliatedProjects[el.Project.Name] = el.Project;
								}
							});

							// get projects where user is leader
							userLeadProjects.getUserLeadProjects(user.Username, 1)
								.then(function (projectsData) {

									// add them to affiliated projects
									projectsData.Projects.forEach(function(el) {
										if (el && !affiliatedProjects[el.Name]) {
											affiliatedProjects[el.Name] = el;
										}
									});
	
									if (!$scope.$$phase) {
										$scope.$apply(function() {
											$scope.affiliatedProjects = affiliatedProjects;
											console.log($scope.affiliatedProjects);
										});
									}

									$scope.affiliatedProjects = affiliatedProjects;
											console.log($scope.affiliatedProjects);
								});																		
						});
					
				});
		}]);
