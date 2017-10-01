
module.exports = function(options) { 
	
	let conduit_list = options;

	return {
		create: function(conduit) {
			for (let c in conduit_list){
				if (c == conduit) {
					return conduit_list[c];
				}
			}
		}
	};
}

