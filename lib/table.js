var _ = require("lodash");

module.exports = function(tableName) {

	// dictionary of actions that use .table() the same way
	var normalTables = [
		"scan",
		"updateItem",
		"query",
		"putItem",
		"getItem",
		"deleteItem",
		"createTable"
	];

	// if the current action is one of the normalTables
	if (_.contains(normalTables, this.currentAction)) {
		this.params.TableName = tableName;
	}

	// if the current aaction is batchGetItems
	if (this.currentAction === "batchGetItems") {

		if (!_.isEmpty(this.key)) {
			this.params.RequestItems[this.tableName].Keys.push(this.key);
		}

		this.key = {};
		this.tableName = tableName;
		this.params.RequestItems[this.tableName] = this.params.RequestItems[this.tableName] || { Keys : [] };
	}

	// if the current action is batchWriteItems
	if (this.currentAction === "batchWriteItems") {

		this.currentTableAction = "";

		if (!_.isEmpty(this.key)) {
			this.params.RequestItems[this.tableName][this.params.RequestItems[this.tableName].length - 1].DeleteRequest.Key = this.key;
		}

		this.key = {};
		this.tableName = tableName;
		this.params.RequestItems[this.tableName] = this.params.RequestItems[this.tableName] || [];
	}

	return this;
};
