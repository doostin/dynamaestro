var _ = require("lodash");

// by default, standard and global indexes will receive 1 readCapacity and 1 writeCapacity.
// provision(), is available to change that when the table is created. this can
// always be updated at aws.amazon.com, so it isn't necessary to determine it at
// the time of creation.
module.exports = function(readCapacity, writeCapacity, indexType, indexName) {

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

		if (indexType === "global" && this.currentAction === "updateTable") {
			this.params.GlobalSecondaryIndexUpdates = this.params.GlobalSecondaryIndexUpdates || [];
			this.params.GlobalSecondaryIndexUpdates.push({
				Update: {
					IndexName: indexName,
					ProvisionedThroughput: {
						ReadCapacityUnits: readCapacity,
						WriteCapacityUnits: writeCapacity
					}
				}
			});
		}

	}

	return this;
};
