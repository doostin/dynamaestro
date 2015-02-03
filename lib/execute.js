var _ = require("lodash");
var marshaler = require('dynamodb-marshaler');
var JSONtoAWS = marshaler.marshalItem;
var AWStoJSON = marshaler.unmarshalItem;

module.exports = function(callback) {

	var DynamoDB = this.DynamoDB;
	var _this = this;

	if (this.currentAction === "getItem") {
		DynamoDB.getItem(this.params, function(error, response) {

			if(!error) {
				response = [response.Item];
				response = response.map(AWStoJSON);
				response = response[0];
			}

			callback(error, response);

		});
	}

	if (this.currentAction === "query" || this.currentAction === "scan") {
		DynamoDB[this.currentAction](this.params, function(error, response) {
	        if (!error) {
	            response = response.Items.map(AWStoJSON);
	        }
	        callback(error, response);
	    });
	}

	if (this.currentAction === "batchGetItems") {

		if (this.key) {
			this.params.RequestItems[this.tableName].Keys.push(this.key);
			this.key = {};
		}

		DynamoDB.batchGetItem(this.params, function(error, response) {

			var keyCount = Object.keys(response.Responses).length;

			var tables = [];

			_.forEach(response.Responses, function(table, index) {

				var tempTable = {
					tableName : index,
					items : []
				};

				tempTable.items = table.map(AWStoJSON);

				tables.push(tempTable);

			});

			callback(error, tables);
		});
	}

	if (this.currentAction === "batchWriteItems") {
		if (!_.isEmpty(this.key)) {
			this.params.RequestItems[this.tableName][this.params.RequestItems[this.tableName].length - 1].DeleteRequest.Key = this.key;
			this.key = {};
		}

		DynamoDB.batchWriteItem(this.params, function(error, response) {
			callback(error, response);
		});
	}

	if (this.currentAction === "putItem") {

		if (!this.allowOverwrites) {
			DynamoDB.describeTable({TableName:this.params.TableName}, function(error, response) {

				if(error) {
					callback(error, null);
					return;
				}

				var expected = {};

				_.forEach(response.Table.KeySchema, function(schema, index) {
					expected[response.Table.KeySchema[index].AttributeName] = {
						Exists : false
					};
				});

				_this.params.Expected = expected;

				DynamoDB.putItem(_this.params, function(error, response) {
					callback(error, response);
				});

			});
		} else {
			DynamoDB.putItem(this.params, function(error, response) {
				callback(error, response);
			});
		}
	}

	if (this.currentAction === "updateItem" || this.currentAction === "deleteItem" || this.currentAction === "createTable") {
		DynamoDB[this.currentAction](this.params, function(error, response) {
	        callback(error, response);
	    });
	}

	this.currentAction = "";
};
