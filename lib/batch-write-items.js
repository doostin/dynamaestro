module.exports = function() {
	this.currentAction = "batchWriteItems";
	this.params = {};
	this.params.RequestItems = {};
	return this;
};
