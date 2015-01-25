var _ = require("lodash");

module.exports = {};

module.exports.name = function(name) {
    this.params.TableName = name;
    return this;
};

module.exports.key = function(type, value, keyType, indexType, indexName) {

    // normalize the type
    type = type.toUpperCase();
    switch(type) {
        case "S":
        case "STRING":
            type = "S";
            break;
        case "N":
        case "number":
            type = "N";
            break;
    }

    // normalize the keyType
    keyType = keyType.toUpperCase();
    switch(keyType) {
        case "H":
        case "HASH":
            keyType = "HASH";
            break;
        case "R":
        case "RANGE":
            keyType = "RANGE";
            break;
    }

    // if there is no indexType, then it must be a standard KeySchema
    if (!indexType) {
        this.params.KeySchema.push({
            AttributeName: value,
            KeyType : keyType
        });
    }

    // if the indexType is global, create a global keySchema.
    if (indexType === "global") {

        // instantiate the GlobalSecondaryIndexes array if it doesn't already exist
        this.params.GlobalSecondaryIndexes = this.params.GlobalSecondaryIndexes || [];

        // check to see if a globalIndex with the indexName has already been created
        var globalIndexExists = _.findIndex(this.params.GlobalSecondaryIndexes, function(globalIndex) {
            return globalIndex.IndexName === indexName;
        });

        // if a globalIndex with the indexName hasn't been created, create it.
        if (globalIndexExists === -1) {
            this.params.GlobalSecondaryIndexes.push({
                IndexName: indexName,
                KeySchema: [{
                    AttributeName: value,
                    KeyType: keyType
                }],
                Projection: {
                    ProjectionType: "ALL"
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                }
            });
        }

        // if a globalIndex with the indexName has been created, add to it
        if (globalIndexExists !== -1) {
            this.params.GlobalSecondaryIndexes[globalIndexExists].KeySchema.push({
                AttributeName: value,
                KeyType: keyType
            });
        }

    }

    // if the indexType is local, create a local keySchema
    if (indexType === "local") {

        // instantiate the LocalSecondaryIndexes array if it doesn't already exist
        this.params.LocalSecondaryIndexes = this.params.LocalSecondaryIndexes || [];

        // check to see if a localIndex with the indexName has already been created
        var LocalIndexExists = _.findIndex(this.params.LocalSecondaryIndexes, function(localIndex) {
            return localIndex.IndexName === indexName;
        });

        // if a localIndex with the indexName hasn't been created, create it.
        if (LocalIndexExists === -1) {
            this.params.LocalSecondaryIndexes.push({
                IndexName: indexName,
                KeySchema: [{
                    AttributeName: value,
                    KeyType: keyType
                }],
                Projection: {
                    ProjectionType: "ALL"
                }
            });
        }

        // if a localIndex with the indexName has been created, add to it.
        if (LocalIndexExists !== -1) {
            this.params.LocalSecondaryIndexes[LocalIndexExists].KeySchema.push({
                AttributeName: value,
                KeyType: keyType
            });
        }

    }

    // regardless of whether it is a standard, global, or local keySchema, every
    // key has to be accounted for in the AttributeDefinitions, but only once.
    // check to see if it exists.
    attributeExists = _.findIndex(this.params.AttributeDefinitions, function(def) {
        return def.AttributeName === value;
    });

    // if the AttributeDefinition doesn't exist, then create it.
    if (attributeExists === -1) {
        this.params.AttributeDefinitions.push({
            AttributeName : value,
            AttributeType : type
        });
    }

    return this;
};

// by default, standard and global indexes will receive 1 readCapacity and 1 writeCapacity.
// provision(), is available to change that when the table is created. this can
// always be updated at aws.amazon.com, so it isn't necessary to determine it at
// the time of creation.
module.exports.provision = function(readCapacity, writeCapacity, indexType, indexName) {

    // if indexType isn't specified, then update the standard read and write
    // capacities
    if (!indexType || !indexName) {
        this.params.ProvisionedThroughput = {
            ReadCapacityUnits: readCapacity,
            WriteCapacityUnits: writeCapacity
        };
    }

    // if indexType and indexName is specified, then update the global secondary
    // index with "indexName" read and write capacities.
    if (indexType && indexName) {

        if (indexType === "global" && this.params.GlobalSecondaryIndexes) {
            var globalIndexExists = _.findIndex(this.params.GlobalSecondaryIndexes, function(globalIndex) {
                return globalIndex.IndexName === indexName;
            });
            if (globalIndexExists !== -1) {
                this.params.GlobalSecondaryIndexes[globalIndexExists].ProvisionedThroughput = {
                    ReadCapacityUnits: readCapacity,
                    WriteCapacityUnits: writeCapacity
                };
            }
        }

    }

    return this;
};

module.exports.run = function(callback) {
    this.ddb.createTable(this.params, function(error, response) {
        callback(error, response);
    });
};
