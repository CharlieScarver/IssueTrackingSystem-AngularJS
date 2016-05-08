'use strict';

angular.module('issueTrackingSystem.users.authorization', [
		'issueTrackingSystem.users.authentication',
		'issueTrackingSystem.users.identity',
		'issueTrackingSystem.projects.getProject',
		'issueTrackingSystem.issues.getIssue'
	])
	.factory('authorization', [
		'$http', 
		'$q',
		'authentication',
		'identity',
		'getProject',
		'getIssue',
		'BASE_URL',
		function($http, $q, authentication, identity, getProject, getIssue, BASE_URL) {

			function checkIfAdmin(projectId) {				
				var deferred = $q.defer();

				if (authentication.isAuthenticated()) {
					identity.getCurrentUser()
						.then(function (user) {
							if (user.isAdmin) {
								deferred.resolve('Has Access');
							} else {
								deferred.reject('Unauthorized Access');								
							}
						});
				} else {
					deferred.reject('Unauthorized Access');	
				}

				return deferred.promise;
			}

			function checkIfProjectLeaderOrAdmin(projectId) {				
				var deferred = $q.defer();

				if (authentication.isAuthenticated()) {
					getProject.getProjectById(projectId)
						.then(function (projectData) {

							identity.getCurrentUser()
								.then(function (user) {
									if (user.Id === projectData.Lead.Id || user.isAdmin) {
										deferred.resolve('Has Access');
									} else {
										deferred.reject('Unauthorized Access');								
									}
								});						
						});
				} else {
					deferred.reject('Unauthorized Access');	
				}

				return deferred.promise;
			}

			function checkIfIssueProjectLeaderOrAdmin(issueId) {
				var deferred = $q.defer();

				if (authentication.isAuthenticated()) {

					getIssue.getIssueById(issueId)
						.then(function (issueData) {
							getProject.getProjectById(issueData.Project.Id)
								.then(function (projectData) {

									identity.getCurrentUser()
										.then(function (user) {
											if (user.Id === projectData.Lead.Id || user.isAdmin) {
												deferred.resolve('Has Access');
											} else {
												deferred.reject('Unauthorized Access');								
											}
										});						
								});
						});
				} else {
					deferred.reject('Unauthorized Access');	
				}

				return deferred.promise;
			}

			return {
				checkIfAdmin: checkIfAdmin,
				checkIfProjectLeaderOrAdmin: checkIfProjectLeaderOrAdmin,
				checkIfIssueProjectLeaderOrAdmin: checkIfIssueProjectLeaderOrAdmin
			}
		}])
