module.exports = function() {
	this.currentAction = "createTable";
	this.params = {};
	this.params.KeySchema = [];
	this.params.AttributeDefinitions = [];
	this.params.ProvisionedThroughput = {
		ReadCapacityUnits: 1,
		WriteCapacityUnits: 1
	};
	return this;
};
