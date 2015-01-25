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

    this.params.Key = this.params.Key || {};

    if (_.isString(value)) {
        value = {
            S : value
        };
    }

    if (_.isNumber(value)) {
        value = {
            N : value.toString()
        };
    }

    this.params.Key[key] = value;
    return this;

};

module.exports.select = function(attributes) {
    this.params.AttributesToGet = attributes;
    return this;
};

module.exports.run = function(callback) {

    this.ddb.getItem(this.params, function(error, response) {
        if(!error) {
            response = [response.Item];
            response = response.map(AWStoJSON);
            response = response[0];
        }
        callback(error, response);
    });

};
