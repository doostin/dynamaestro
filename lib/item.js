var marshaler = require('dynamodb-marshaler');
var JSONtoAWS = marshaler.marshalItem;
var AWStoJSON = marshaler.unmarshalItem;

module.exports = function(item) {
	if (this.currentAction === "putItem") {
		this.params.Item = JSONtoAWS(item);
	}
	return this;
};
