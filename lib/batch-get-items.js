module.exports = function() {
	if (this.currentAction !== "batchGetItems") {
		this.currentAction = "batchGetItems";
		this.params = {};
		this.params.RequestItems = {};
	}
	return this;
};
