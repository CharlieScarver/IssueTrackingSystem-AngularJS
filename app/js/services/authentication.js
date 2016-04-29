'use strict';

angular.module('issueTrackingSystem.users.authentication', [
		//'issueTrackingSystem.users.identity'
	])
	.factory('authentication', [
		'$http', 
		'$q',
		'$cookies',
		'BASE_URL',
		function($http, $q, $cookies, BASE_URL) {

			var AUTHENTICATION_COOKIE_KEY = '!__Authentication_Cookie_Key__!';

			function preserveUserData(data) {
				var accessToken = data.access_token;
				
				$http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
				
				$cookies.put(AUTHENTICATION_COOKIE_KEY, accessToken);
			}

			function loginUser(user) {
				var deferred = $q.defer();

				var loginData = 'Username=' + user.email + '&Password=' + user.password + '&grant_type=password',
					request = {
					    method: 'POST',
					    url: BASE_URL + 'api/Token',
					    data: loginData,
					    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
					};

				$http(request)
					.then(function (response) {
						preserveUserData(response.data);
						deferred.resolve();
					});

				return deferred.promise;
			}

			function registerUser(user) {
				var deferred = $q.defer();

				var registerData = 'Email=' + user.email 
						+ '&Password=' + user.password 
						+ '&ConfirmPassword=' + user.confirmPassword,
					request = {
					    method: 'POST',
					    url: BASE_URL + 'api/Account/Register',
					    data: registerData,
					    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
					};

				$http(request)
					.then(function () {
						loginUser(user)
							.then(function () {
								deferred.resolve();
							});
					});

				return deferred.promise;
			}

			function isAuthenticated() {
				return !!$cookies.get(AUTHENTICATION_COOKIE_KEY);
			}

			function logout() {
				$cookies.remove(AUTHENTICATION_COOKIE_KEY);
				$http.defaults.headers.common.Authorization = undefined;				
			}

			function refreshCookie() {
				if (isAuthenticated()) {
					$http.defaults.headers.common.Authorization = $cookies.get(AUTHENTICATION_COOKIE_KEY);
				}
			}

			return {
				registerUser: registerUser,
				loginUser: loginUser,
				isAuthenticated: isAuthenticated,
				logout: logout,
				refreshCookie: refreshCookie
			}
		}])

