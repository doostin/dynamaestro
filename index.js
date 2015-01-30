var aws = require('aws-sdk');

module.exports = function(config) {
    aws.config.update({
        "accessKeyId" : config.credentials.accessKeyId,
        "secretAccessKey" : config.credentials.secretAccessKey,
        "region" : config.region
    });

    this.DynamoDB = new aws.DynamoDB({apiVersion: '2012-08-10'});

    return this;
};

module.exports.prototype = {
    getItem: require("./lib/get-item"),
    scan: require("./lib/scan"),
    query: require("./lib/query"),
    batchGetItems: require("./lib/batch-get-items"),
    batchWriteItems: require("./lib/batch-write-items"),
    putItem: require("./lib/put-item"),
    updateItem: require("./lib/update-item"),
    deleteItem: require("./lib/delete-item"),
    createTable: require("./lib/create-table"),
    deleteTable: require("./lib/delete-table"),
    listTables: require("./lib/list-tables"),
    describeTable: require("./lib/describe-table"),
    whenTableExists: require("./lib/when-table-exists"),
    whenTableDoesntExist: require("./lib/when-table-doesnt-exist"),
    allowOverwrite: require("./lib/allow-overwrite"),
    item: require("./lib/item"),
    delete: require("./lib/delete"),
    put: require("./lib/put"),
    increment: require("./lib/increment"),
    table: require("./lib/table"),
    select: require("./lib/select"),
    where: require("./lib/where"),
    execute: require("./lib/execute"),
    key: require("./lib/key"),
    provision: require("./lib/provision")
};
