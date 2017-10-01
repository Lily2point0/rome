require('dotenv').config();
module.exports = {
    	account: 	process.env.CONFIG_SMS_ACCOUNT,
    	auto_token: process.env.CONFIG_SMS_TOKEN,
    	number: 	process.env.CONFIG_SMS_NUMBER

};
