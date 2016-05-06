'use strict';

angular.module('issueTrackingSystem', [
		'ngRoute',
		'ngCookies',
		'issueTrackingSystem.common',
		'issueTrackingSystem.home',
		'issueTrackingSystem.logout',
		'issueTrackingSystem.projects.projectPage',
		'issueTrackingSystem.issues.issuePage',
		'issueTrackingSystem.projects.editProjectPage'
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
					}

					console.log(rejection);
					return $q.reject(rejection);
				}
			}
		}]);
	}])
	.run(['$rootScope', '$location', 'authentication', function ($rootScope, $location, authentication) {
			$rootScope.$on('$routeChangeError', function (ev, current, previous, rejection) {
				if (rejection === 'Unauthorized Access') {
					$location.path('/');
					console.log(rejection);
				}			
			});

			authentication.refreshCookie();
	}])
	.constant('toastr', toastr)
	.constant('BASE_URL','http://softuni-issue-tracker.azurewebsites.net/');
