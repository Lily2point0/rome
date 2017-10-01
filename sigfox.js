

module.exports = function(options) { 
	
	return {
		processCommand: function(text) {
		},

		parse: function(pressed_by) { 
			return {
				getText: function() { 
					return 'You have been summoned by ' + pressed_by;
				}
			};
		},

		// Shortcuts to the API
		sendMessage:    function() {}
	};
}

