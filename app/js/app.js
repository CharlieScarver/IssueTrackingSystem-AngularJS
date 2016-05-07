'use strict';

angular.module('issueTrackingSystem', [
		'ngRoute',
		'ngCookies',
		'issueTrackingSystem.common',
		'issueTrackingSystem.home',
		'issueTrackingSystem.users.logout',
		'issueTrackingSystem.users.changePasswordPage',
		'issueTrackingSystem.projects.projectPage',		
		'issueTrackingSystem.projects.editProjectPage',
		'issueTrackingSystem.projects.addIssuePage',
		'issueTrackingSystem.issues.issuePage',
		'issueTrackingSystem.issues.editIssuePage'
	])
	.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
		$routeProvider.otherwise({redirectTo: '/'});

		$httpProvider.interceptors.push(['$q', 'toastr', function ($q, toastr) {
			return {
				'responseError' : function (rejection) {
					if (rejection.data && rejection.data['error_description']) {
						toastr.error(rejection.data['error_description']);
					} else if (rejection.data && rejection.data.ModelState && rejection.data.ModelState['']) {
						var errors = rejection.data.ModelState[''];
						if (errors.length > 0) {
							toastr.error(errors[0]);
						}
						console.log(errors[0]);
					} else if (rejection.data && rejection.data.Message) {
						toastr.error(rejection.data.Message);
					}

					console.log(rejection);
					return $q.reject(rejection);
				}
			}
		}]);
	}])
	.run(['$rootScope', '$location', 'authentication', 'toastr', 
		function ($rootScope, $location, authentication, toastr) {
			$rootScope.$on('$routeChangeError', function (ev, current, previous, rejection) {
				if (rejection === 'Unauthorized Access') {
					$location.path('/');
					console.log(rejection);
				}
				toastr.error(rejection);		
			});

			authentication.refreshCookie();
			$rootScope.__isAuthenticated = authentication.isAuthenticated();
		}])
	.constant('toastr', toastr)
	.constant('BASE_URL','http://softuni-issue-tracker.azurewebsites.net/');
