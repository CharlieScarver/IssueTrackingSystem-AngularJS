angular.module('issueTrackingSystem.filters.characterLimit', [])
	.filter('characterLimit', [function() {
		return function(input, characters) {
			characters = characters || 50;

			return input.substr(0, parseInt(characters) - 3) + '...';
		}
	}])