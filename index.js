require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const xemail = require('./email.js')(require('./config/email'));
const xsms = require('./sms.js')(require('./config/sms'));
const xslack = require('./slack.js')(require('./config/slack'));
const xvoice = require('./voice.js')(require('./config/voice'));
const xsigfox  = require('./sigfox.js')();

const userdb = require('./userdb.js')();
const calendar = require('./calendar.js')();
const api = require('./api.js')();

var conduit = require('./conduit.js')({sms: xsms, slack: xslack, email: xemail, voice: xvoice});


if (!api.isKeyValid("")) {
	return;
}

app.get('/sms', (req, res) => {
    const msg = xsms.parse(req.query);
    if (msg.their_number == xsms.getNumber()) {
    	// Don't process SMS messages that we've sent
    	return;
    }
	let output;

	if (output = xsms.processCommand(msg.message)) {
		xsms.sendMessage(msg.their_number, output);
		return;
	} 

	// Find conduit
	const user = userdb.getFromVirtualNumber(msg.our_number);
    res.json(forwardMessage(calendar, user, msg));
    return;
});

app.get('/sigfox/:id', (req, res) => {
    console.log(req.params.id);
    const msg = xsigfox.parse(req.params.id);

	// Find conduit
	const user = userdb.getFromSigfox(req.params.id);
    res.json(forwardMessage(calendar, user, msg));
    return;
});

app.get('/voice_out', (req, res) => {
	console.log("Voice : ", req.query);
	if (req.query.direction == 'inbound') {
		// When someone calls us
		const user = userdb.getFromVirtualNumber(req.query.to);
		const msg = forwardMessage(calendar, user, {getText: function() {return '';} } );
	    console.log('inbound : ', msg);
		res.send(msg);

	} else { // When we're calling someone else
	    const msg = xvoice.getXML(req.query.call_sid);
	    console.log('outbound : ', msg);
		res.send(msg);
	}
    return;
});

app.get('/audio/:sid', (req, res) => {
	const fileID = req.params.sid;
	return res.sendFile(path.resolve(path.join(__dirname +'/temp/'+fileID+'.mp3')));
});

app.get('/answer_phone', (req, res) => {
	const fileID = req.params.sid;
	return res.sendFile(path.resolve(path.join(__dirname +'/audio/answer_phone.mp3')));
});
	
function forwardMessage(calendar, user, msg) {
	if (calendar === undefined || user == undefined) {
		console.log('Cant forard message without a user and calender');
		return;
	}
	calendar.getEventNow(user.calendar, function(info) {
		// Send via conduit
		const pass_to = conduit.create(info.conduit);
		const real_address = user.addressLookup(info.conduit, info.address);

		pass_to.sendMessage(real_address, msg.getText());

		console.log(`Sending to ${real_address} via ${info.conduit}`);
		console.log(msg.getText());
	}).then(data => console.log(`All done ${data}`)).catch(err => console.log(err)) ;	
}


xslack.receive(data => {
	if(data.subtitle !== undefined && !data.subtitle.includes('bot')) {
		const msg = xslack.parse(data);
		const user = userdb.getFromSlack(msg.from);

		console.log('SLACK INCOMING::', msg, user);
		return forwardMessage(calendar, user, msg);
	}
});


app.listen(2017);
console.log("Ready...");
