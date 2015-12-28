var assert = require("chai").assert;
var _ = require("lodash");
var dynamaestro = require("../index.js");
var config = require("./config.json");

var ddb = new dynamaestro(config.options);

var tableResponse;
var globalIndexIndex;

describe("Table Tests", function() {

	describe("#createTable()", function() {
		it("TableDescription.TableStatus should equal \"CREATING\"", function(done) {
			ddb.createTable()
				.table(config.tableName)
				.key("string", "userId", "HASH")
				.key("string", "itemId", "RANGE")
				.key("string", "userId", "HASH", "global", "userByCount")
				.key("number", "count", "RANGE", "global", "userByCount")
				.key("string", "userId", "HASH", "local", "userByDate")
				.key("number", "created", "RANGE", "local", "userByDate")
				.provision(5, 10)
				.provision(10, 20, "global", "userByCount")
				.execute(function(error, response) {
					if (error) return done(error);
					tableResponse = response;
					assert.equal("CREATING", response.TableDescription.TableStatus);
					done();
				});
		});

		it("KeySchema should contain a HASH called \"userId\" and a RANGE called \"itemId\"", function(done) {
			if (_.isEmpty(tableResponse)) return done(new Error("No response stored from createTable()"));
			var hasHashUserId = _.findIndex(tableResponse.TableDescription.KeySchema, function(key) {
				return key.AttributeName === "userId" && key.KeyType === "HASH";
			});
			var hasRangeItemId = _.findIndex(tableResponse.TableDescription.KeySchema, function(key) {
				return key.AttributeName === "itemId" && key.KeyType === "RANGE";
			});
			assert.notEqual(-1, hasHashUserId);
			assert.notEqual(-1, hasRangeItemId);
			done();
		});

		it("Should contain a single global index", function(done) {
			if (_.isEmpty(tableResponse)) return done(new Error("No response stored from createTable()"));
			assert.equal(1, tableResponse.TableDescription.GlobalSecondaryIndexes.length);
			done();
		});

		it("Global index should be called \"userByCount\"", function(done) {
			if (_.isEmpty(tableResponse)) return done(new Error("No response stored from createTable()"));
			var hasGlobalSecondaryIndexUserByCount = _.findIndex(tableResponse.TableDescription.GlobalSecondaryIndexes, function(globalIndex) {
				return globalIndex.IndexName === "userByCount";
			});
			globalIndexIndex = hasGlobalSecondaryIndexUserByCount;
			assert.notEqual(-1, hasGlobalSecondaryIndexUserByCount);
			done();
		});

		it("Global index should contain a HASH called \"userId\" and a RANGE called \"count\"", function(done) {
			if (_.isEmpty(tableResponse)) return done(new Error("No response stored from createTable()"));
			var hasHashUserId = _.findIndex(tableResponse.TableDescription.GlobalSecondaryIndexes[globalIndexIndex].KeySchema, function(key) {
				return key.AttributeName === "userId" && key.KeyType === "HASH";
			});
			var hasRangeCount = _.findIndex(tableResponse.TableDescription.GlobalSecondaryIndexes[globalIndexIndex].KeySchema, function(key) {
				return key.AttributeName === "count" && key.KeyType === "RANGE";
			});
			assert.notEqual(-1, hasHashUserId);
			assert.notEqual(-1, hasRangeCount);
			done();
		});
	});

	describe("#whenTableExists()", function() {
		this.timeout(200000);
		it("Should return a table object with Table.TableStatus set to \"ACTIVE\"", function(done) {
			ddb.whenTableExists(config.tableName, function(error, response) {
				if (error) return done(error);
				assert.equal("ACTIVE", response.Table.TableStatus);
				done();
			});
		});
	});

	describe("#updateTable()", function() {
		it("Table should be in \"UPDATING\" status", function(done) {
			ddb.updateTable()
				.table(config.tableName)
				.provision(10, 5)
				.provision(20, 10, "global", "userByCount")
				.execute(function(error, response) {
					if (error) return done(error);
					assert.equal("UPDATING", response.TableDescription.TableStatus);
					done();
				});
		});
		it("Table's main ProvisionedThroughput should be updated.", function(done) {
			this.timeout(200000);
			var interval;
			var count = 0;
			interval = setInterval(function() {
				if(count < 25) {
					count++;
					ddb.describeTable(config.tableName, function(error, response) {
						if(error) {
							clearInterval(interval);
							return done(error);
						}
						if(response.Table.TableStatus === "ACTIVE") {
							assert.equal(10, response.Table.ProvisionedThroughput.ReadCapacityUnits);
							assert.equal(5, response.Table.ProvisionedThroughput.WriteCapacityUnits);
							clearInterval(interval);
							return done();
						}
					});
				} else {
					clearInterval(interval);
					return done(new Error("After 25 tries, table never had ProvisionedThroughput updated"));
				}
			}, 20000);
		});
		it("Table's globalIndex ProvisionedThroughput should be updated.", function(done) {
			this.timeout(200000);
			var interval;
			var count = 0;
			interval = setInterval(function() {
				if(count < 25) {
					count++;
					ddb.describeTable(config.tableName, function(error, response) {
						if(error) {
							clearInterval(interval);
							return done(error);
						}
						if(response.Table.GlobalSecondaryIndexes[0].IndexStatus === "ACTIVE") {
							assert.equal(20, response.Table.GlobalSecondaryIndexes[0].ProvisionedThroughput.ReadCapacityUnits);
							assert.equal(10, response.Table.GlobalSecondaryIndexes[0].ProvisionedThroughput.WriteCapacityUnits);
							clearInterval(interval);
							return done();
						}
					});
				} else {
					clearInterval(interval);
					return done(new Error("After 25 tries, table never had ProvisionedThroughput updated"));
				}
			}, 20000);
		});
	});

	describe("#listTables()", function() {
		it("Table list should contain " + "\"" + config.tableName + "\"", function(done) {
			ddb.listTables(function(error, response) {
				if (error) return done(error);
				assert.equal(true, _.contains(response.TableNames, config.tableName));
				done();
			});
		});
	});

	describe("#describeTable()", function() {
		it("Should return a table object with Table.TableName equal to \"" + config.tableName + "\"", function(done) {
			ddb.describeTable(config.tableName, function(error, response) {
				if (error) return done(error);
				assert.equal(config.tableName, response.Table.TableName);
				done();
			});
		});
	});

	describe("#deleteTable()", function() {
		it("TableDescription.TableStatus should equal \"DELETING\"", function(done) {
			ddb.deleteTable(config.tableName, function(error, response) {
				if (error) return done(error);
				assert.equal("DELETING", response.TableDescription.TableStatus);
				done();
			});
		});
	});

	describe("#whenTableDoesntExist()", function() {
		this.timeout(200000);
		it("Response should be empty", function(done) {
			ddb.whenTableDoesntExist(config.tableName, function(error, response) {
				if (error) return done(error);
				assert.equal(true, _.isEmpty(response));
				done();
			});
		});
	});

});
