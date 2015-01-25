var marshaler = require('dynamodb-marshaler');
var JSONtoAWS = marshaler.marshalItem;
var AWStoJSON = marshaler.unmarshalItem;

module.exports = {};

module.exports.table = function(table) {
    this.params.TableName = table;
    return this;
};

module.exports.select = function(attributes) {
    this.params.AttributesToGet = attributes;
    this.params.Select = "SPECIFIC_ATTRIBUTES";
    return this;
};

module.exports.run = function(callback) {
    this.ddb.scan(this.params, function(error, response) {
        if (!error) {
            response = response.Items.map(AWStoJSON);
        }
        callback(error, response);
    });
};
