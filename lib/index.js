var aws = require("aws-sdk");
var _ = require("lodash");

module.exports = function(config) {
	this.DynamoDB = new aws.DynamoDB(_.merge({apiVersion: "2012-08-10"}, config));
	this.params = {};
	return this;
};

module.exports.prototype = {
	getItem: require("./get-item"),
	scan: require("./scan"),
	query: require("./query"),
	globalIndex: require("./global-index"),
	batchGetItems: require("./batch-get-items"),
	batchWriteItems: require("./batch-write-items"),
	putItem: require("./put-item"),
	updateItem: require("./update-item"),
	deleteItem: require("./delete-item"),
	createTable: require("./create-table"),
	updateTable: require("./update-table"),
	deleteTable: require("./delete-table"),
	listTables: require("./list-tables"),
	describeTable: require("./describe-table"),
	whenTableExists: require("./when-table-exists"),
	whenTableDoesntExist: require("./when-table-doesnt-exist"),
	allowOverwrite: require("./allow-overwrite"),
	item: require("./item"),
	filter: require("./filter"),
	limit: require("./limit"),
	delete: require("./delete"),
	put: require("./put"),
	increment: require("./increment"),
	table: require("./table"),
	select: require("./select"),
	where: require("./where"),
	execute: require("./execute"),
	key: require("./key"),
	provision: require("./provision")
};
