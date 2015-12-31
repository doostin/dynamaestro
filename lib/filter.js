var _ = require("lodash");
var numberOfFilters = 0;

module.exports = function(name, operator, value) {
	if(this.currentAction === "scan" || this.currentAction === "query") {
		this.params.FilterExpression = this.params.FilterExpression ? this.params.FilterExpression + " AND " : "";
		this.params.ExpressionAttributeNames = this.params.ExpressionAttributeNames || {};
		this.params.ExpressionAttributeValues = this.params.ExpressionAttributeValues || {};

		var nameKey = "#name" + numberOfFilters;
		var valueKey = ":value" + numberOfFilters;
		var comparisonOperator = " " + operator + " ";
		var filterExpression = nameKey + comparisonOperator + valueKey;

		this.params.FilterExpression = this.params.FilterExpression + filterExpression;

		this.params.ExpressionAttributeNames[nameKey] = name;

		this.params.ExpressionAttributeValues[valueKey] = {};

		var type;
		switch (true) {
			case _.isString(value):
				type = "S";
				break;
			case _.isNumber(value):
				type = "N";
				break;
			case _.isBoolean(value):
				type = "BOOL";
				break;
		}
		this.params.ExpressionAttributeValues[valueKey][type] = value;


		return this;
	}
};
