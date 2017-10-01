const nodemailer = require('nodemailer');

module.exports = options => {
	function sendMail(user, message) {
		nodemailer.createTestAccount((err, account) => {
		    // create reusable transporter object using the default SMTP transport
		    let transporter = nodemailer.createTransport({
		        host: options.host,
		        port: 465,
		        secure: true, // true for 465, false for other ports
		        auth: {
		            user: options.username, // generated ethereal user
		            pass: options.password  // generated ethereal password
		        }
		    });

		    // setup email data with unicode symbols
		    let mailOptions = {
		        from: '"TADHackBot 🤖" <foo@blurdybloop.com>', // sender address
		        to: user, // list of receivers
		        subject: 'Message transfer', // Subject line
		        text: message, // plain text body
		        html: `<p>${message}</p>` // html body
		    };

		    // send mail with defined transport object
		    transporter.sendMail(mailOptions, (error, info) => {
		        if (error) {
		            return console.log(error);
		        }
		        console.log('Message sent: %s', info.messageId);
		    });
		});
	}

	return {
		sendMessage: sendMail
	}
}
