const SlackBot = require('slackbots');

module.exports = options => {
	const bot = new SlackBot({
		token: options.token,
		name: options.botname
	});

	function postToSlack(user, message) {
		bot.postMessageToUser(user, message, { icon_emoji: ':robot_face:'});
	}

	function listenToMessages(callback) {
		bot.on('message', callback)
	}

	function formatMessage(data) {
		return {
			from: 	data.subtitle,
			message: data.content,

			getText: function() { 
				return this.message;
			}
		};
	}

	return {
		sendMessage: postToSlack,
		receive: listenToMessages,
		parse: formatMessage
	}
}
