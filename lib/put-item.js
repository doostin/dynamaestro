module.exports = function() {
	if(this.currentAction !== "putItem") {
		this.currentAction = "putItem";
		this.params = {};
		this.allowOverwrites = false;
	}
	return this;
};
