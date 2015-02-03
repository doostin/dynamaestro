module.exports = function() {
	if(this.currentAction !== "getItem") {
		this.currentAction = "getItem";
		this.params = {};
	}
	return this;
};
