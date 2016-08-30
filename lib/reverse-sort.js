module.exports = function() {
	if(this.currentAction === "query") {
		this.params.ScanIndexForward = false;
		return this;
	}
};
