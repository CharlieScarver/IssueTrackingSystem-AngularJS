'use strict';

angular.module('issueTrackingSystem.home', [
		'issueTrackingSystem.users.authentication',
		'issueTrackingSystem.users.identity',
		'issueTrackingSystem.issues.userIssues',
		'issueTrackingSystem.projects.userLeadProjects',
		'issueTrackingSystem.filters.characterLimit',
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
		'$rootScope',
		'$route',
		'$timeout',
		'authentication',
		'identity',
		'userIssues',
		'userLeadProjects',
		function HomeController($scope, $rootScope, $route, $timeout, 
			authentication, identity, userIssues, userLeadProjects) {
					
			function changeActiveIssuePageButton(page) {
				$('.issue-page-btn').removeClass('btn-success');
				$('#ipb-' + page).addClass('btn-success');
			}

			function changeActiveProjectPageButton(page) {
				$('.project-page-btn').removeClass('btn-success');
				$('#ppb-' + page).addClass('btn-success');
			}

			var affiliatedProjects = [];
			
			$scope.isAuthenticated = authentication.isAuthenticated();
			if ($scope.isAuthenticated) {
				// if a user is already authenticated
				$rootScope.__isAuthenticated = true;
			} else {
				$rootScope.__isAuthenticated = false;
			}
			
			$scope.currentIssuePage = 1;	
			$scope.currentProjectPage = 1;

			$scope.login = function (user) {
				authentication.loginUser(user)
					.then(function () {
						$route.reload();						
						toastr.success('You successfully logged in.');
						$rootScope.__isAuthenticated = true;
					});
			};

			$scope.register = function (user) {
				authentication.registerUser(user)
					.then(function () {
						$route.reload();
						toastr.success('You successfully registered and logged in.');
						$rootScope.__isAuthenticated = true;
					});
			};

			if ($rootScope.__isAuthenticated) {

				$scope.getIssuesPage = function (page) {

					if (parseInt(page) !== parseInt($scope.currentIssuePage)) {
						userIssues.getUserIssues(page)
							.then(function (issuesData){
								$scope.userIssues = issuesData.Issues;
								$scope.totalIssuePages = issuesData.TotalPages;
								$scope.currentIssuePage = page;
							});

						changeActiveIssuePageButton(page);
					}
				};

				$scope.getProjectsPage = function (page) {

					if (page !== $scope.currentProjectPage) {
						userLeadProjects.getUserLeadProjects($scope.currentUser.Id, page)
								.then(function (issuesData){
									$scope.affiliatedProjects = issuesData.Projects;
									$scope.totalProjectsPages = issuesData.TotalPages;
									$scope.currentProjectPage = page;
								});

						changeActiveProjectPageButton(page);
					}
				};


				// get current user
				identity.getCurrentUser()
					.then(function (user) {
						$scope.currentUser = user;
						$scope.isAuthenticated = true;

						// get issues
						userIssues.getUserIssues(1)
							.then(function (issuesData){
								$scope.userIssues = issuesData.Issues;
								$scope.totalIssuePages = issuesData.TotalPages;				

								// TODO: Add issue projects to affiliated
								// add issue projects to affiliated projects
								//$scope.userIssues.forEach(function(el) {
									//if (el) {
										//affiliatedProjects.push(el.Project);
									//}
								//});

								// get projects where user is leader
								userLeadProjects.getUserLeadProjects(user.Id, 1)
									.then(function (projectsData) {
										$scope.totalProjectsPages = projectsData.TotalPages;	

										// add them to affiliated projects
										projectsData.Projects.forEach(function(el) {
											if (el) {
												affiliatedProjects.push(el);
											}
										});

										$scope.affiliatedProjects = affiliatedProjects;

										// giving time for the ng-repeat to be executed after scope update
										$timeout(function () {
											changeActiveIssuePageButton($scope.currentIssuePage);
											changeActiveProjectPageButton($scope.currentProjectPage);
										}, 0);
									});																		
							});
						
					});	

			} // if authenticated	
		}]);
