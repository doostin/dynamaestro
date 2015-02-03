module.exports = function() {
	if (this.currentAction !== "batchWriteItems") {
		this.currentAction = "batchWriteItems";
		this.params = {};
		this.params.RequestItems = {};
	}
	return this;
};
