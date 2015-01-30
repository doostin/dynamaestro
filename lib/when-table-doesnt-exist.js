module.exports = function(table, callback) {
	this.DynamoDB.waitFor("tableNotExists", { TableName: table }, function(error, response) {
		callback(error, response);
	});
};
