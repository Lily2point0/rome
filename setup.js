require('dotenv').config();
const apifonica = require('apifonica');
const options = require('./config/sms');

let url = process.env.SETUP_URL;
let phone_number;
let app_sid;

apifonica.api.setAccount(options.account)
	.setAuthToken(options.auto_token)
	.setNumberSMS(options.number);

apifonica.app.create(url, 'GET', 'My Patch App').then(function(msg_info) {
        console.log("create : msg_info "+ JSON.stringify(msg_info));
        app_sid = msg_info.getApplicationSID();
        console.log("app_sid : "+ app_sid);
        return apifonica.account.getCountryList();
    
    // Results from getCountryList 
    }).then(function(msg_info) {
        console.log("getCountryList : success "+ JSON.stringify(msg_info));

        return apifonica.numbers.getList('GB');//body.result.countries[0].country_code);

    // Results from getPhoneList
    }).then(function(msg_info) {
        console.log("getPhoneList : msg_info "+ JSON.stringify(msg_info));
        // ,"voice":false
        var sms = apifonica.getFirstSMS(msg_info.result.available_numbers);
        phone_number = sms.number;
        console.log("phone_number : "+ phone_number);
        return apifonica.numbers.rentNumber(phone_number, '', app_sid);
    
    // Results from rentNumber
    }).then(function(msg_info) {
        console.log("rentNumber : msg_info "+ JSON.stringify(msg_info));
	});

