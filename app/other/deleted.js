// add-issue, edit-project
var routeChecks = {
	authenticatedProjectLeaderOrAdmin: ['$q', '$route', 'authorization', 
		function ($q, $route, authorization) {				
			var projectId = $route.current.params.id;

			authorization.checkIfProjectLeaderOrAdmin(projectId)
				.then(function (succ) {
					return $q.when(true);
				}, function (err) {
					return $q.reject('Unauthorized Access');
				});
		}]
};
//---------------------------
// edit-issue
var routeChecks = {
	authenticatedProjectLeaderOrAdmin: ['$q', '$route', 'authorization', 
		function ($q, $route, authorization) {				
			var issueId = $route.current.params.id;

			authorization.checkIfIssueProjectLeaderOrAdmin(issueId)
				.then(function (succ) {
					return $q.when(true);
				}, function (err) {
					return $q.reject('Unauthorized Access');
				});
		}]
};

$routeProvider.when('/issues/:id/edit', {
	templateUrl: 'views/edit-issue.html',
	controller: 'EditIssuePageController',
	resolve: routeChecks.authenticatedProjectLeaderOrAdmin
})
//---------------------------
// all-projects
var routeChecks = {
	authenticatedAndAdmin: ['$q', 'authorization', 
		function ($q, authorization) {				

			authorization.checkIfAdmin()
				.then(function (succ) {
					return $q.when(true);
				}, function (err) {
					return $q.reject('Unauthorized Access');
				});
		}]
};
//---------------------------

