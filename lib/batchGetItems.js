var _ = require("lodash");
var marshaler = require('dynamodb-marshaler');
var JSONtoAWS = marshaler.marshalItem;
var AWStoJSON = marshaler.unmarshalItem;

module.exports = {};

module.exports.table = function(table) {

    if (this.key) {
        this.params.RequestItems[this.tableName].Keys.push(this.key);
    }

    this.key = {};
    this.tableName = table;
    this.params.RequestItems[this.tableName] = this.params.RequestItems[this.tableName] || { Keys : [] };

    return this;

};

module.exports.where = function(key, value, nextKey) {

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

    return this;

};

module.exports.select = function(attributes) {
    this.params.RequestItems[this.tableName].AttributesToGet = attributes;
    return this;
};

module.exports.run = function(callback) {

    if (this.key) {
        this.params.RequestItems[this.tableName].Keys.push(this.key);
        this.key = {};
    }

    this.ddb.batchGetItem(this.params, function(error, response) {

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
};
