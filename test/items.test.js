var assert = require("chai").assert;
var expect = require("chai").expect;
var should = require("chai").should();
var _ = require("lodash");
var async = require("async");
var uuid = require("node-uuid");
var dynamaestro = require("../index.js");
var config = require("./config.json");

var ddb = new dynamaestro(config.options);

var names = ["bob", "jim", "sam", "sally", "jill", "joey", "chloe"];
var now = new Date();
var tempItem = {
    "testObj": {
        "work": {
            "something": "something else too",
            "array": [
                "five",
                2,
                "three"
            ]
        },
        "this": "will"
    },
    "created": now.getTime()
};
var testItems = [];
for (var i = 0; i < 25; i++) {
	var item = _.cloneDeep(tempItem);
	item.userId = names[_.random(0,6)];
	item.itemId = uuid.v4();
	item.count = i + 200;
	testItems.push(item);
}

describe("Item Tests", function() {

    describe("##Prepping table for tests", function(){
        it("Should create a primary test table", function(done) {
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
                    assert.equal("CREATING", response.TableDescription.TableStatus);
                    done();
                });
        });
        it("Should create a secondary test table", function(done) {
            ddb.createTable()
                .table(config.tableName+"2")
                .key("string", "userId", "HASH")
                .key("number", "count", "RANGE")
                .provision(5, 10)
                .execute(function(error, response) {
                    if (error) return done(error);
                    assert.equal("CREATING", response.TableDescription.TableStatus);
                    done();
                });
        });
        it("Primary test table should exist before we start working with it", function(done) {
            this.timeout(200000);
            ddb.whenTableExists(config.tableName, function(error, response) {
                if (error) return done(error);
                assert.equal("ACTIVE", response.Table.TableStatus);
                done();
            });
        });
        it("Secondary test table should exist before we start working with it", function(done) {
            this.timeout(200000);
            ddb.whenTableExists(config.tableName+"2", function(error, response) {
                if (error) return done(error);
                assert.equal("ACTIVE", response.Table.TableStatus);
                done();
            });
        });
        it("Filling secondary test table with data", function(done) {
            ddb.batchWriteItems()
                .table(config.tableName+"2");

            _.forEach(testItems, function(item) {
                ddb.batchWriteItems().put(item);
            });

            ddb.batchWriteItems().execute(function(error, response) {
                if (error) return done(error);
                expect(response.UnprocessedItems).to.be.empty();
                done();
            });
        });
    });

    describe("#batchWriteItems()", function() {
        it("Should return a response with an empty \"UnprocessedItems\" object", function(done) {
            ddb.batchWriteItems()
                .table(config.tableName);

            _.forEach(testItems, function(item) {
                ddb.batchWriteItems().put(item);
            });

            ddb.batchWriteItems().execute(function(error, response) {
                if (error) return done(error);
                expect(response.UnprocessedItems).to.be.empty();
                done();
            });
        });

        it("Should be able to delete two items using seperate delete chains", function(done) {
            var item = _.cloneDeep(tempItem);
            item.userId = names[_.random(0,6)];
            item.itemId = uuid.v4();
            item.count = _.random(200,500);

            ddb.batchWriteItems()
                .table(config.tableName)
                .put(item)
                .delete()
                .where("userId", testItems[0].userId)
                .where("itemId", testItems[0].itemId)
                .delete()
                .where("userId", testItems[1].userId)
                .where("itemId", testItems[1].itemId)
                .execute(function(error, response) {
                    if (error) return done(error);
                    expect(response.UnprocessedItems).to.be.empty();
                    done();
                });
        });
        it("Should be able to write and delete items on two tables", function(done) {
            var item = _.cloneDeep(tempItem);
            item.userId = names[_.random(0,6)];
            item.itemId = uuid.v4();
            item.count = _.random(200,500);

            ddb.batchWriteItems()
                .table(config.tableName)
                .put(item)
                .delete()
                .where("userId", testItems[11].userId)
                .where("itemId", testItems[11].itemId)
                .table(config.tableName+"2")
                .put(item)
                .delete()
                .where("userId", testItems[11].userId)
                .where("count", testItems[11].count)
                .execute(function(error, response) {
                    if (error) return done(error);
                    expect(response.UnprocessedItems).to.be.empty();
                    done();
                });
        });
        it("Should be able to delete two items using the same delete chain", function(done) {
            var item = _.cloneDeep(tempItem);
            item.userId = names[_.random(0,6)];
            item.itemId = uuid.v4();
            item.count = _.random(200,500);

            ddb.batchWriteItems()
                .table(config.tableName)
                .put(item)
                .delete()
                .where("userId", testItems[2].userId)
                .where("itemId", testItems[2].itemId)
                .where("userId", testItems[3].userId, true)
                .where("itemId", testItems[3].itemId)
                .execute(function(error, response) {
                    if (error) return done(error);
                    expect(response.UnprocessedItems).to.be.empty();
                    done();
                });
        });
        it("Should be able to delete two items using the same delete chain before putting an item", function(done) {
            var item = _.cloneDeep(tempItem);
            item.userId = names[_.random(0,6)];
            item.itemId = uuid.v4();
            item.count = _.random(200,500);

            ddb.batchWriteItems()
                .table(config.tableName)
                .delete()
                .where("userId", testItems[4].userId)
                .where("itemId", testItems[4].itemId)
                .where("userId", testItems[5].userId, true)
                .where("itemId", testItems[5].itemId)
                .put(item)
                .execute(function(error, response) {
                    if (error) return done(error);
                    expect(response.UnprocessedItems).to.be.empty();
                    done();
                });
        });
    });

	describe("#scan()", function(){
		it("Should receive an array of items", function(done) {
			ddb.scan()
				.table(config.tableName)
				.execute(function(error, response) {
					if (error) return done(error);
					assert.equal(false, _.isEmpty(response));
					done();
				});
		});

		it("Should receive an array of items with only two keys per item (userId & itemId)", function(done) {
			ddb.scan()
				.table(config.tableName)
				.select(["userId", "itemId"])
				.execute(function(error, response) {
					if (error) return done(error);
					assert.equal(2, Object.keys(response[0]).length);
					done();
				});
		});
	});

    describe("#query()", function() {
        it("Should return array of " + testItems[0].userId + "\'s items", function(done) {
            ddb.query()
                .table(config.tableName)
                .where("userId", "EQ", testItems[0].userId)
                .execute(function(error, response) {
                    if (error) return done(error);

                    var userIsCorrect = true;
                    _.forEach(response, function(item) {
                        if (item.userId !== testItems[0].userId) {
                            userCheck = false;
                            return false;
                        }
                    });
                    expect(userIsCorrect).to.be.true();
                    done();
                });
        });
        it("Should return array of " + testItems[6].userId + "\'s items where count is between 100 & 500 using a globalIndex", function(done) {
            ddb.query()
                .table(config.tableName)
                .globalIndex("userByCount")
                .where("userId", "EQ", testItems[6].userId)
                .where("count", "BETWEEN", [100, 500])
                .execute(function(error, response) {
                    if (error) return done(error);
                    expect(response).to.be.a("array");
                    done();
                });
        });
        it("Should return array of " + testItems[6].userId + "\'s rows items while selecting userId and itemId", function(done) {
            ddb.query()
                .table(config.tableName)
                .where("userId", "EQ", testItems[6].userId)
                .select(["userId", "itemId"])
                .execute(function(error, response) {
                    if (error) return done(error);

                    var userIsCorrect = true;
                    _.forEach(response, function(item) {
                        if (item.userId !== testItems[6].userId) {
                            userCheck = false;
                            return false;
                        }
                    });
                    assert.equal(2, Object.keys(response[0]).length);
                    done();
                });
        });
        it("Should get an item back from secondary table... User: " + testItems[6].userId + " Count: " + testItems[6].count, function(done) {
            ddb.query()
                .table(config.tableName+"2")
                .where("userId", "EQ", testItems[6].userId)
                .where("count", "EQ", testItems[6].count)
                .execute(function(error, response) {
                    if (error) return done(error);
                    assert.equal(testItems[6].userId, response[0].userId);
                    assert.equal(testItems[6].count, response[0].count);
                    done();
                });
        });
        it("Should get items back from secondary table... User: " + testItems[6].userId + " Count: BETWEEN 0 & 500", function(done) {
            ddb.query()
                .table(config.tableName+"2")
                .where("userId", "EQ", testItems[6].userId)
                .where("count", "BETWEEN", [0, 500])
                .execute(function(error, response) {
                    if (error) return done(error);
                    expect(response).to.not.be.empty();
                    done();
                });
        });
    });

    describe("#batchGetItems()", function() {
        it("Should get two items", function(done) {
            ddb.batchGetItems()
                .table(config.tableName)
                .where("userId", testItems[6].userId)
                .where("itemId", testItems[6].itemId)
                .where("userId", testItems[7].userId, true)
                .where("itemId", testItems[7].itemId)
                .execute(function(error, response) {
                    if (error) return done(error);
                    assert.equal(2, response[0].items.length);
                    done();
                });
        });
        it("Should get two items with only userId and itemId", function(done) {
            ddb.batchGetItems()
                .table(config.tableName)
                .where("userId", testItems[6].userId)
                .where("itemId", testItems[6].itemId)
                .where("userId", testItems[7].userId, true)
                .where("itemId", testItems[7].itemId)
                .select(["userId", "itemId"])
                .execute(function(error, response) {
                    if (error) return done(error);
                    assert.equal(2, Object.keys(response[0].items[0]).length);
                    done();
                });
        });
        it("Should get items from two diffent tables", function(done) {
            ddb.batchGetItems()
                .table(config.tableName)
                .where("userId", testItems[6].userId)
                .where("itemId", testItems[6].itemId)
                .where("userId", testItems[7].userId, true)
                .where("itemId", testItems[7].itemId)
                .table(config.tableName+"2")
                .where("userId", testItems[6].userId)
                .where("count", testItems[6].count)
                .execute(function(error, response) {
                    if (error) return done(error);
                    assert.equal(2, response.length);
                    done();
                });
        });
    });

    describe("#putItem()", function() {
        it("Should get an empty response back", function(done) {
            var item = _.cloneDeep(tempItem);
            item.userId = names[_.random(0,6)];
            item.itemId = uuid.v4();
            item.count = _.random(200,500);

            ddb.putItem()
                .table(config.tableName)
                .item(item)
                .execute(function(error, response) {
                    if (error) return done(error);
                    expect(response).to.be.empty();
                    done();
                });
        });
        it("Should throw an error because table doesn't exist", function(done) {
            var item = _.cloneDeep(tempItem);
            item.userId = names[_.random(0,6)];
            item.itemId = uuid.v4();
            item.count = _.random(200,500);

            ddb.putItem()
                .table("fdsfds")
                .item(item)
                .execute(function(error, response) {
                    expect(error.code).to.equal("ResourceNotFoundException");
                    done();
                });
        });
        it("Should allow overwrites and get an empty response back", function(done) {
            ddb.putItem()
                .table(config.tableName)
                .allowOverwrite(true)
                .item(testItems[10])
                .execute(function(error, response) {
                    if (error) return done(error);
                    expect(response).to.be.empty();
                    done();
                });
        });
    });

    describe("#getItem()", function() {
        it("Should return item with itemId " + testItems[8].itemId, function(done) {
            ddb.getItem()
                .table(config.tableName)
                .where("userId", testItems[8].userId)
                .where("itemId", testItems[8].itemId)
                .execute(function(error, response) {
                    if (error) return done(error);
                    expect(response.itemId).to.equal(testItems[8].itemId);
                    done();
                });
        });
        it("Should return item from secondary table with count EQ to " + testItems[8].count, function(done) {
            ddb.getItem()
                .table(config.tableName+"2")
                .where("userId", testItems[8].userId)
                .where("count", testItems[8].count)
                .execute(function(error, response) {
                    if (error) return done(error);
                    expect(response.count).to.equal(testItems[8].count);
                    done();
                });
        });
        it("Should return item with itemId " + testItems[8].itemId + "with only count returned", function(done) {
            ddb.getItem()
                .table(config.tableName)
                .where("userId", testItems[8].userId)
                .where("itemId", testItems[8].itemId)
                .select(["count"])
                .execute(function(error, response) {
                    if (error) return done(error);
                    assert.equal(1, Object.keys(response).length);
                    expect(response.count).to.exist();
                    done();
                });
        });
    });

    describe("#deleteItem()", function() {
        it("Should return an empty response", function(done) {
            ddb.deleteItem()
                .table(config.tableName)
                .where("userId", testItems[9].userId)
                .where("itemId", testItems[9].itemId)
                .execute(function(error, response) {
                    if (error) return done(error);
                    expect(response).to.be.empty();
                    done();
                });
        });
    });

    describe("#updateItem()", function() {
        it("Should return an empty response", function(done) {
            var newItemObject = {
                "oneThing": "orAnother",
                "someArray": [1,2,3,4,"five"],
                "nestedObject" : {
                    "name" : "sam"
                }
            };
            ddb.updateItem()
                .table(config.tableName)
                .where("userId", testItems[10].userId)
                .where("itemId", testItems[10].itemId)
                .put("newObject", newItemObject)
                .delete("testObj")
                .increment("count", 10)
                .execute(function(error, response) {
                    if (error) return done(error);
                    expect(response).to.be.empty();
                    done();
                });
        });
    });

    describe("##Cleaning up database from tests", function() {
        it("Deleting primary test table", function(done) {
            ddb.deleteTable(config.tableName, function(error, response) {
                if (error) return done(error);
                assert.equal("DELETING", response.TableDescription.TableStatus);
                done();
            });
        });
        it("Deleting secondary test table", function(done) {
            ddb.deleteTable(config.tableName+"2", function(error, response) {
                if (error) return done(error);
                assert.equal("DELETING", response.TableDescription.TableStatus);
                done();
            });
        });
        it("Waiting until primary test table doesn't exist before moving on", function(done) {
            this.timeout(200000);
            ddb.whenTableDoesntExist(config.tableName, function(error, response) {
                if (error) return done(error);
                expect(response).to.be.empty();
                done();
            });
        });
        it("Waiting until secondary test table doesn't exist before moving on", function(done) {
            this.timeout(200000);
            ddb.whenTableDoesntExist(config.tableName+"2", function(error, response) {
                if (error) return done(error);
                expect(response).to.be.empty();
                done();
            });
        });
    });

});
