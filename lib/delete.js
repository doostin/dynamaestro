var _ = require("lodash");

module.exports = function(arg1, arg2) {

	var key, value;

	if (this.currentAction === "batchWriteItems") {
		if (!_.isEmpty(this.key) && this.currentTableAction === "del") {
			this.params.RequestItems[this.tableName][this.params.RequestItems[this.tableName].length - 1].DeleteRequest.Key = this.key;
		}

		this.currentTableAction = "del";

		this.params.RequestItems[this.tableName].push({
			DeleteRequest: {
				Key: {}
			}
		});
	}

	if (this.currentAction === "updateItem") {

		key = arg1;
		value = arg2;

		this.params.AttributeUpdates[key] = {};
		this.params.AttributeUpdates[key].Action = "DELETE";
	}

	return this;
};
