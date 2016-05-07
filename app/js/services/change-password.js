'use strict';

angular.module('issueTrackingSystem.users.changeUserPassword', [])
	.factory('changeUserPassword', [
		'$http', 
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
		
			function changePassword(user) {
				var deferred = $q.defer();
				var request,
					passwordData = 'OldPassword=' + user.oldPass
						+ '&NewPassword=' + user.newPass
						+ '&ConfirmPassword=' + user.confirmPass;
						
				request = {
				    method: 'POST',
				    url: BASE_URL + 'api/Account/ChangePassword',
				    data: passwordData,
				    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
				};

				$http(request)
					.then(function (response) {
						deferred.resolve(response.data);
					});

				return deferred.promise;
			}			

			return {
				changePassword: changePassword
			}
		}])