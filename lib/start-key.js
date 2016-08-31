module.exports = function(startKey) {
	if(this.currentAction === "query" || this.currentAction === "scan") {
		this.params.ExclusiveStartKey = startKey;
		return this;
	}
};
