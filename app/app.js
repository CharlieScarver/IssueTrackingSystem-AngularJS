'use strict';

angular.module('issueTrackingSystem', [
  'ngRoute'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
