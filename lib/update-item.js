module.exports = function() {
	if (this.currentAction !== "updateItem") {
		this.currentAction = "updateItem";
		this.params = {};
		this.params.AttributeUpdates = {};
	}
	return this;
};
