module.exports = function() {
	if (this.currentAction !== "deleteItem") {
		this.currentAction = "deleteItem";
		this.params = {};
	}
	return this;
};
