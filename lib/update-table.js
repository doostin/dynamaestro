module.exports = function() {
	if (this.currentAction !== "updateTable") {
		this.currentAction = "updateTable";
		this.params = {};
	}
	return this;
};
