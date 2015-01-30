module.exports = function(table, callback) {
	this.DynamoDB.waitFor("tableExists", { TableName: table }, function(error, response) {
		callback(error, response);
	});
};
