module.exports = function(attributes) {

	if (this.currentAction === "getItem" || this.currentAction === "query") {
		this.params.AttributesToGet = attributes;
	}

	if (this.currentAction === "scan") {
		this.params.AttributesToGet = attributes;
		this.params.Select = "SPECIFIC_ATTRIBUTES";
	}

	if (this.currentAction === "batchGetItems") {
		this.params.RequestItems[this.tableName].AttributesToGet = attributes;
	}

	return this;
};
