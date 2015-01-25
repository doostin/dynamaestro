var _ = require("lodash");
var marshaler = require('dynamodb-marshaler');
var JSONtoAWS = marshaler.marshalItem;
var AWStoJSON = marshaler.unmarshalItem;

module.exports = {};

module.exports.table = function(table) {
    this.params.TableName = table;
    return this;
};

module.exports.where = function(key, value) {

    if (_.isString(value)) {
        this.params.Key[key] = {
            S : value
        };
    }

    if(_.isNumber(value)) {
        this.params.Key[key] = {
            N : value.toString()
        };
    }

    return this;

};

module.exports.put = function(key, value) {

    this.params.AttributeUpdates[key] = {};
    this.params.AttributeUpdates[key].Action = "PUT";
    this.params.AttributeUpdates[key].Value = {};

    var tempValue = {
        Value : value
    };

    this.params.AttributeUpdates[key].Value = JSONtoAWS(tempValue).Value;

    return this;

};

module.exports.increment = function(key, value) {

    this.params.AttributeUpdates[key] = {};
    this.params.AttributeUpdates[key].Action = "ADD";
    this.params.AttributeUpdates[key].Value = {};

    var tempValue = {
        Value : value
    };

    this.params.AttributeUpdates[key].Value = JSONtoAWS(tempValue).Value;

    return this;

};

module.exports.delete = function(key, value) {

    this.params.AttributeUpdates[key] = {};
    this.params.AttributeUpdates[key].Action = "DELETE";

    return this;

};

module.exports.save = function(callback) {

    this.ddb.updateItem(this.params, function(error, response) {
        callback(error, response);
    });

};
