module.exports = function() {
	if(this.currentAction !== "query") {
		this.currentAction = "query";
		this.params = {};
	}
	return this;
};
