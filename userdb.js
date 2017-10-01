require('dotenv').config();
module.exports = function(options) { 
const steev = {
	name: "Steev",
	calendar: process.env.CALENDAR_URL,

	email: { personal: process.env.STEEV_EMAIL },
	slack: { work: process.env.STEEV_SLACK },
	sms: { mobile: process.env.STEEV_PHONE },
	voice: { mobile: process.env.STEEV_PHONE },

	sigfox: "Steev",
	virtual: process.env.STEEV_PHONE_VIRTUAL,
	virtual_sms: process.env.STEEV_SMS_VIRTUAL,
};
const lily = {
	name: "Lily",
	calendar: process.env.CALENDAR_URL,

	email: { personal:  process.env.LILY_EMAIL},
	slack: { work: process.env.LILY_SLACK },
	sms: { mobile: process.env.LILY_PHONE },
	voice: { mobile: process.env.LILY_PHONE },

	sigfox: "Lily",
};
// TODO: Add resend flag so email->email transitions don't happen

	return {
		getFromPhone: function(number) {
			let user;

			if (number === steev.sms.mobile) {
				user = steev;
			} else if (number === lily.sms.mobile) {
				user = lily;
			}
			if (user) {
				user.addressLookup = function(conduit, address) {
					return this[conduit] && this[conduit][address] && this[conduit][address];
				}
			}

			return user;
		},
		
		getFromSigfox: function(number) {
			let user;

			if (number === steev.sigfox) {
				user = lily;
			} else if (number === lily.sigfox) {
				user = steev;
			}
			if (user) {
				user.addressLookup = function(conduit, address) {
					return this[conduit] && this[conduit][address] && this[conduit][address];
				}
			}

			return user;
		},


		getFromVirtualNumber: function(number) {
			let user;

			if (number === steev.virtual || number == steev.virtual_sms) {
				user = steev;
			} else if (number === lily.virtual) {
				user = lily;
			}
			if (user) {
				user.addressLookup = function(conduit, address) {
					return this[conduit] && this[conduit][address] && this[conduit][address];
				}
			}

			return user;
		},

		fixUser: function(user) {

			if (user) {
				user.addressLookup = function(conduit, address) {
					return this[conduit] && this[conduit][address] && this[conduit][address];
				}
			}

			return user;
		},

		getFromSlack: function(from) {
			let user;

			if(from === lily.name) {
				user = steev;
			} else if (from === steev.name) {
				user = lily;
			}

			if (user) {
				user.addressLookup = function(conduit, address) {
					return this[conduit] && this[conduit][address] && this[conduit][address];
				}
			}

			return user;
		}	
	};
}
