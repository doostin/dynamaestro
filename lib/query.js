var _ = require("lodash");
var marshaler = require('dynamodb-marshaler');
var JSONtoAWS = marshaler.marshalItem;
var AWStoJSON = marshaler.unmarshalItem;

module.exports = {};

module.exports.table = function(table) {
    this.params.TableName = table;
    return this;
};

module.exports.globalIndex = function(name) {
    this.params.IndexName = name;
    return this;
};

module.exports.where = function(key, operator, value) {

    if (value.constructor === Array) {
        var tempValues = [];
        _.forEach(value, function(val) {

            var tempValue;

            if (_.isString(val)) {
                tempValue = {
                    S : val
                };
            }

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
    return this;
};

module.exports.select = function(attributes) {
    this.params.AttributesToGet = attributes;
    return this;
};

module.exports.run = function(callback) {

    this.ddb.query(this.params, function(error, response) {
        if (!error) {
            response = response.Items.map(AWStoJSON);
        }
        callback(error, response);
    });

};
