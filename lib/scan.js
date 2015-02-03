module.exports = function() {
	if (this.currentAction !== "scan") {
		this.currentAction = "scan";
		this.params = {};
	}
	return this;
};
