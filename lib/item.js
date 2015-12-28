var marshaler = require("dynamodb-marshaler");
var JSONtoAWS = marshaler.marshalItem;

module.exports = function(item) {
	if (this.currentAction === "putItem") {
		this.params.Item = JSONtoAWS(item);
	}
	return this;
};
