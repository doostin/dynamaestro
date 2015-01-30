module.exports = function(table, callback) {
	this.DynamoDB.describeTable({ TableName: table }, function(error, response) {
		callback(error, response);
	});
};
