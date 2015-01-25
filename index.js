var aws = require('aws-sdk');
var ddb;

module.exports = {
    connect: function(credentials, region) {
        aws.config.update({
            "accessKeyId" : credentials.accessKeyId,
            "secretAccessKey" : credentials.secretAccessKey,
            "region" : region
        });

        ddb = new aws.DynamoDB({apiVersion: '2012-08-10'});
    },
    scan: function() {
        this.ddb = ddb;
        this.params = {};
    },
    query: function() {
        this.ddb = ddb;
        this.params = {};
    },
    getItem: function() {
        this.ddb = ddb;
        this.params = {};
    },
    batchGetItems: function() {
        this.ddb = ddb;
        this.params = {};
        this.params.RequestItems = {};
    },
    batchWriteItems: function() {
        this.ddb = ddb;
        this.params = {};
        this.params.RequestItems = {};
    },
    putItem: function() {
        this.ddb = ddb;
        this.params = {};
    },
    updateItem: function() {
        this.ddb = ddb;
        this.params = {};
        this.params.Key = {};
        this.params.AttributeUpdates = {};
    },
    deleteItem: function() {
        this.ddb = ddb;
        this.params = {};
        this.params.Key = {};
    },
    createTable: function() {
        this.ddb = ddb;
        this.params = {};
        this.params.KeySchema = [];
        this.params.AttributeDefinitions = [];
        this.params.ProvisionedThroughput = {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        };
    },
    deleteTable: function(table, callback) {
        ddb.deleteTable({ TableName: table }, function(error, response) {
            callback(error, response);
        });
    },
    listTables: function(callback) {
        ddb.listTables({}, function(error, response) {
            callback(error, response);
        });
    },
    describeTable: function(table, callback) {
        ddb.describeTable({ TableName: table }, function(error, response) {
            callback(error, response);
        });
    },
    whenTableExists: function(table, callback) {
        ddb.waitFor("tableExists", { TableName: table }, function(error, response) {
            callback(error, response);
        });
    },
    whenTableDoesntExist: function(table, callback) {
        ddb.waitFor("tableNotExists", { TableName: table }, function(error, response) {
            callback(error, response);
        });
    }
};

module.exports.scan.prototype = require("./lib/scan");
module.exports.query.prototype = require("./lib/query");
module.exports.getItem.prototype = require("./lib/getItem");
module.exports.putItem.prototype = require("./lib/putItem");
module.exports.updateItem.prototype = require("./lib/updateItem");
module.exports.deleteItem.prototype = require("./lib/deleteItem");
module.exports.batchGetItems.prototype = require("./lib/batchGetItems");
module.exports.batchWriteItems.prototype = require("./lib/batchWriteItems");
module.exports.createTable.prototype = require("./lib/createTable");
