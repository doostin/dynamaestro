var _ = require("lodash");
var marshaler = require('dynamodb-marshaler');
var JSONtoAWS = marshaler.marshalItem;
var AWStoJSON = marshaler.unmarshalItem;

module.exports = function(arg1, arg2) {

	var key, value, item;

	if (this.currentAction === "batchWriteItems") {

		item = arg1;

		if (!_.isEmpty(this.key) && this.currentTableAction === "del") {
			this.params.RequestItems[this.tableName][this.params.RequestItems[this.tableName].length - 1].DeleteRequest.Key = this.key;
			this.key = {};
		}

		this.currentTableAction = "put";

		this.params.RequestItems[this.tableName].push({
			PutRequest: {
				Item: JSONtoAWS(item)
			}
		});
	}

	if (this.currentAction === "updateItem") {

		key = arg1;
		value = arg2;

		this.params.AttributeUpdates[key] = {};
		this.params.AttributeUpdates[key].Action = "PUT";
		this.params.AttributeUpdates[key].Value = {};

		var tempValue = {
			Value : value
		};

		this.params.AttributeUpdates[key].Value = JSONtoAWS(tempValue).Value;
	}

	return this;
};
