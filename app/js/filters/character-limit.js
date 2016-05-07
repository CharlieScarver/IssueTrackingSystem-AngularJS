angular.module('issueTrackingSystem.filters.characterLimit', [])
	.filter('characterLimit', [function() {
		return function(input, characters) {
			var smallInput = false;
			input = input || "";
			characters = characters || 50;

			if (input.length < parseInt(characters) - 3) {
				smallInput = true;
			}

			return smallInput ? input : input.substr(0, parseInt(characters) - 3) + '...';
		}
	}])