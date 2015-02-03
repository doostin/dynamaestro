var _ = require("lodash");

module.exports = function(arg1, arg2, arg3) {

	var key, value, operator, nextKey;

	var normalWhere = [
		"updateItem",
		"getItem",
		"deleteItem"
	];

	if (_.contains(normalWhere, this.currentAction)) {

		// map key and value to arguments
		key = arg1;
		value = arg2;

		this.params.Key = this.params.Key || {};

		if (_.isString(value)) {
			this.params.Key[key] = {
				S : value
			};
		}

		if (_.isNumber(value)) {
			this.params.Key[key] = {
				N : value.toString()
			};
		}
	}

	if (this.currentAction === "query") {

		// map key, value and nextKey to arguments
		key = arg1;
		operator = arg2;
		value = arg3;

		if (_.isArray(value)) {
			var tempValues = [];
			_.forEach(value, function(val) {

				var tempValue;

				if (_.isNumber(val)) {
					tempValue = {
						N : val.toString()
					};
				}

				tempValues.push(tempValue);

			});
			value = tempValues;
		}

		if (_.isString(value)) {
			value = [{
				S : value
			}];
		}

		if (_.isNumber(value)) {
			value = [{
				N : value.toString()
			}];
		}

		this.params.KeyConditions = this.params.KeyConditions || {};
		this.params.KeyConditions[key] = {
			ComparisonOperator : operator,
			AttributeValueList : value
		};

	}

	if (this.currentAction === "batchGetItems") {

		// map key, value, nextKey
		key = arg1;
		value = arg2;
		nextKey = arg3;

		if (nextKey) {
			this.params.RequestItems[this.tableName].Keys.push(this.key);
			this.key = {};
		}

		if (_.isString(value)) {
			this.key[key] = {
				S : value
			};
		}

		if (_.isNumber(value)) {
			this.key[key] = {
				N : value.toString()
			};
		}
	}

	if (this.currentAction === "batchWriteItems") {

		// map key, value, nextKey
		key = arg1;
		value = arg2;
		nextKey = arg3;

		if (nextKey) {
			this.params.RequestItems[this.tableName][this.params.RequestItems[this.tableName].length - 1].DeleteRequest.Key = this.key;
			this.key = {};
		}

		if (_.isString(value)) {
			this.key[key] = {
				S : value
			};
		}

		if (_.isNumber(value)) {
			this.key[key] = {
				N : value.toString()
			};
		}

	}

	return this;
};
