let ical = require("node-ical");

// The calendar format is
//   conduit:ID
//e.g.
//   sms:mobile

module.exports = function(options) { 
	return {
		getEventNow: function(url, cbfn) {
			return new Promise((resolve, reject) => {
				ical.fromURL(url, {}, function(err, data) {
					let now = new Date();
					for (let k in data){
					    if (data.hasOwnProperty(k)) {
					    	let ev = data[k];
							if (now.getTime() >= ev.start.getTime() && now.getTime() <= ev.end.getTime()) {
								let contacts = ev.summary.split(",");
								for(let idx=0;idx<contacts.length;++idx) {
									let details = contacts[idx].split(":");
									cbfn({conduit: details[0].trim(), address: details[1].trim()});
								}
							}
					    }
					}
					resolve(data);
				});
			});
		}
	};
}
