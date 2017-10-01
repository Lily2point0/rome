const apifonica = require('apifonica');

module.exports = function(options) { 
	
	apifonica.api.setAccount(options.account)
		.setAuthToken(options.auto_token)
		.setNumberSMS(options.number);

	return {
		processCommand: function(text) {
			switch(text.toLowerCase()) {
				case "help":
				return "This number will forward your message to the person, on whatever platform they're live on at the time.";
			}
			//
			return undefined;
		},

		parse: function(options) { 
			return {
				our_number: 	options.to, 
				their_number: 	options.from, 
				message: 		options.text,

				getText: function() { 
					return this.message;
				}
			};
		},

		getNumber: function() {
			return options.number;
		},

		// Shortcuts to the API
		sendMessage:    apifonica.sms.send,
		getMessageInfo: apifonica.sms.getMessageInfo,
		getMessageList: apifonica.sms.getMessageList,

		// For low level access to the API
		api: function() { 
			return apifonica;
		}
	};
}

