module.exports = function(callback) {
	this.DynamoDB.listTables({}, function(error, response) {
		callback(error, response);
	});
};
