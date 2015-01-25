var _ = require("lodash");
var marshaler = require("dynamodb-marshaler");
var JSONtoAWS = marshaler.marshalItem;
var AWStoJSON = marshaler.unmarshalItem;

module.exports = {};

module.exports.table = function(table) {
    this.params.TableName = table;
    this.allowDuplicates = false;
    return this;
};

module.exports.item = function(item) {
    this.params.Item = JSONtoAWS(item);
    return this;
};

module.exports.allowOverwrite = function() {
    this.allowDuplicates = true;
    return this;
};

module.exports.save = function(callback) {

    var _this = this;

    if (!this.allowDuplicates) {
        this.ddb.describeTable({TableName:this.params.TableName}, function(error, response) {

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

            console.log(JSON.stringify(_this.params, null, 4));

            _this.ddb.putItem(_this.params, function(error, response) {
                callback(error, response);
            });

        });
    } else {
        this.ddb.putItem(this.params, function(error, response) {
            callback(error, response);
        });
    }

};
