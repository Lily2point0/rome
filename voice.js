require('dotenv').config();
const apifonica = require('apifonica');
const needle = require('needle');
const ACTION_FORWARD = 'forward';
const ACTION_PLAY_MP3 = 'play';

module.exports = function(options) { 
	
	apifonica.api.setAccount(options.account)
		.setAuthToken(options.auto_token)
		.setNumberVoice(options.number);

	var messageCache = {};

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
				our_number: 	options.from, 
				their_number: 	options.to, 
				message: 		options.text,

				getText: function() { 
					return this.message;
				}
			};
		},

		// Shortcuts to the API
		sendMessage:    function(number, message) {
			if (message == '') {
				// When there is no message, we are a forwarding relay
				console.log('Applying forward...');
				apifonica.call.make(number).then(function(info) {
					let sid = info.getCallSID();
					messageCache[sid] = { action: ACTION_FORWARD, number: number }
				});
				return;
			}

			apifonica.call.make(number).then(function(info) {
				let sid = info.getCallSID();

				// This method of generating text to speech (TTS) is taken from the
				// ttsmp3 package (https://www.npmjs.com/package/ttsmp3) which, for reasons
				// know only to itself, refused to work on my machine Therefore, I copied
				// the essential code in line.
				var filename = sid + '.mp3';
				messageCache[sid] = { action: ACTION_PLAY_MP3, mp3: process.env.LOCAL_URL + "/audio/" + sid };

			    var base = 'http://vozme.com/';
			    var opts = {
			        text : message,
			        lang : 'en',
			        gn : 'fm',
			        interface : 'full'
			    };

			    needle.post(base + 'text2voice.php', opts, {}, function(err, resp) {
			        if (err) {
			            console.log('Error: couldn\'t get download link');
			        }

			        var url = base + resp.body.split('<source')[1].split('"')[1];
			        needle.get(url, { output : 'temp/' + filename }, function(err, resp, body) {
			            if (err) {
			                console.log('Error: couldn\'t download mp3');
			                return false;
			            }

			            console.log('output ');
			            return true;
			        });
			    });
			});

		},

		getXML: function(call_sid) {
			console.log('sid', call_sid);
			console.log('messageCache', messageCache);

			switch(messageCache[call_sid].action) {
				case ACTION_FORWARD:
					return this.getForward(messageCache[call_sid].number);
				case ACTION_PLAY_MP3:
					return this.getMessage(messageCache[call_sid].mp3);
			}
		},

		getForward: function(number) {
			var msg = '<?xml version="1.0" encoding="UTF-8" ?>';
			msg += '<response>';
			msg += '<makeCall from="441144630001">';
			msg += '<number>' + number + '</number>'
			msg += '</makeCall>'
			msg += '</response>'
			return msg;
		},

		getMessage: function(mp3) {
			var msg = '<?xml version="1.0" encoding="UTF-8" ?>';
			msg += '<response>';
			msg += '<playAudio loops="1">' + mp3 + '</playAudio>';
			msg += '<endCall signal="reject" />';
			msg += '</response>'
			return msg;
		},

		// For low level access to the API
		api: function() { 
			return apifonica;
		}
	};
}

