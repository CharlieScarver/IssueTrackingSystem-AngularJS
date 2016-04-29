'use strict';

angular.module('issueTrackingSystem.users.authentication', [
		//'issueTrackingSystem.users.identity'
	])
	.factory('authentication', [
		'$http', 
		'$q',
		'BASE_URL',
		function($http, $q, BASE_URL) {

			function loginUser(user) {
				var loginData = 'Username=' + user.email + '&Password=' + user.password + '&grant_type=password',
					request = {
					    method: 'POST',
					    url: BASE_URL + 'api/Token',
					    data: loginData,
					    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
					};

				return $http(request);
			}

			function registerUser(user) {
				var registerData = 'Email=' + user.email 
						+ '&Password=' + user.password 
						+ '&ConfirmPassword=' + user.confirmPassword,
					request = {
					    method: 'POST',
					    url: BASE_URL + 'api/Account/Register',
					    data: registerData,
					    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
					};

				return $http(request);
			}

			function registerAndLoginUser(user) {
				var deferred = $q.defer();

				registerUser(user)
					.then(function () {
						deferred.resolve(loginUser(user));
					});

				return deferred.promise;
			}

			return {
				registerUser: registerAndLoginUser,
				loginUser: loginUser
			}
		}])

