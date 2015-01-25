var _ = require("lodash");
var marshaler = require('dynamodb-marshaler');
var JSONtoAWS = marshaler.marshalItem;
var AWStoJSON = marshaler.unmarshalItem;

module.exports = {};

module.exports.table = function(table) {

    this.currentAction = "";

    if (!_.isEmpty(this.key)) {
        this.params.RequestItems[this.tableName][this.params.RequestItems[this.tableName].length - 1].DeleteRequest.Key = this.key;
    }

    this.key = {};
    this.tableName = table;
    this.params.RequestItems[this.tableName] = this.params.RequestItems[this.tableName] || [];

    return this;

};

module.exports.del = function() {

    if (!_.isEmpty(this.key) && this.currentAction === "del") {
        this.params.RequestItems[this.tableName][this.params.RequestItems[this.tableName].length - 1].DeleteRequest.Key = this.key;
    }

    this.currentAction = "del";

    this.params.RequestItems[this.tableName].push({
        DeleteRequest: {
            Key: {}
        }
    });

    return this;
};

module.exports.put = function(item) {

    if (!_.isEmpty(this.key) && this.currentAction === "del") {
        this.params.RequestItems[this.tableName][this.params.RequestItems[this.tableName].length - 1].DeleteRequest.Key = this.key;
        this.key = {};
    }

    this.currentAction = "put";

    this.params.RequestItems[this.tableName].push({
        PutRequest: {
            Item: JSONtoAWS(item)
        }
    });

    return this;
};

module.exports.where = function(key, value, nextKey) {

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

    return this;

};

module.exports.save = function(callback) {

    if (!_.isEmpty(this.key)) {
        this.params.RequestItems[this.tableName][this.params.RequestItems[this.tableName].length - 1].DeleteRequest.Key = this.key;
        this.key = {};
    }

    this.ddb.batchWriteItem(this.params, function(error, response) {
        callback(error, response);
    });

};
