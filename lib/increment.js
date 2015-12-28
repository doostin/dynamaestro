var marshaler = require("dynamodb-marshaler");
var JSONtoAWS = marshaler.marshalItem;

module.exports = function(key, value) {

	if (this.currentAction === "updateItem") {
		this.params.AttributeUpdates[key] = {};
		this.params.AttributeUpdates[key].Action = "ADD";
		this.params.AttributeUpdates[key].Value = {};

		var tempValue = {
			Value : value
		};

		this.params.AttributeUpdates[key].Value = JSONtoAWS(tempValue).Value;
	}

	return this;
};
