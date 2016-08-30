var aws = require("aws-sdk");
var _ = require("lodash");

module.exports = function(config) {
	this.DynamoDB = new aws.DynamoDB(_.merge({apiVersion: "2012-08-10"}, config));
	this.params = {};
	return this;
};

module.exports.prototype = {
	allowOverwrite: require("./allow-overwrite"),
	batchGetItems: require("./batch-get-items"),
	batchWriteItems: require("./batch-write-items"),
	createTable: require("./create-table"),
	delete: require("./delete"),
	deleteItem: require("./delete-item"),
	deleteTable: require("./delete-table"),
	describeTable: require("./describe-table"),
	execute: require("./execute"),
	filter: require("./filter"),
	getItem: require("./get-item"),
	globalIndex: require("./global-index"),
	increment: require("./increment"),
	item: require("./item"),
	key: require("./key"),
	limit: require("./limit"),
	listTables: require("./list-tables"),
	provision: require("./provision"),
	put: require("./put"),
	putItem: require("./put-item"),
	query: require("./query"),
	scan: require("./scan"),
	select: require("./select"),
	table: require("./table"),
	updateItem: require("./update-item"),
	updateTable: require("./update-table"),
	whenTableDoesntExist: require("./when-table-doesnt-exist"),
	whenTableExists: require("./when-table-exists"),
	where: require("./where")
};
