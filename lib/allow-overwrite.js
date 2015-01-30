var _ = require("lodash");

module.exports = function(value) {
	if((_.isEmpty(value) || value === true) && this.currentAction === "putItem") {
		this.allowOverwrites = true;
	}
	return this;
};
