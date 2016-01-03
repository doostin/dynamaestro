module.exports = function(count) {
	if (this.currentAction === "query" || this.currentAction === "scan") {
		this.params.Limit = count;
	}
	return this;
};
