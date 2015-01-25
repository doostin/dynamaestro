var _ = require("lodash");

module.exports = {};

module.exports.table = function(table) {
    this.params.TableName = table;
    return this;
};

module.exports.where = function(key, value) {

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

module.exports.destroy = function(callback) {

    this.ddb.deleteItem(this.params, function(error, response) {
        callback(error, response);
    });

};
