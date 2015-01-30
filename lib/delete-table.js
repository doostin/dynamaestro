module.exports = function(table, callback) {
	this.DynamoDB.deleteTable({ TableName: table }, function(error, response) {
		callback(error, response);
	});
};
