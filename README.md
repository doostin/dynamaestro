# DynaMaestro

DynaMaestro was developed to provide an easier way to access a DynamoDB. A lot
of the functions use chaining methods to hide away the AWS specific ideology.

[![NPM](https://nodei.co/npm/dynamaestro.png?downloads=true&downloadRank=false&stars=true)](https://nodei.co/npm/dynamaestro/)

## Installation

```
npm install dynamaestro
```

## Documentation

### Setup
* [`config`](#config)

### Items

* [`putItem`](#putItem)
* [`batchWriteItems`](#batchWriteItems)
* [`getItem`](#getItem)
* [`batchGetItems`](#batchGetItems)
* [`query`](#query)
* [`scan`](#scan)
* [`updateItem`](#updateItem)
* [`deleteItem`](#deleteItem)

### Tables

* [`createTable`](#createTable)
* [`listTables`](#listTables)
* [`describeTable`](#describeTable)
* [`deleteTable`](#deleteTable)

### Utilities

* [`whenTableExists`](#whenTableExists)
* [`whenTableDoesntExist`](#whenTableDoesntExist)

## Setup

<!-- Connect -->
<a name="connect"></a>

### connect(credentials, region)

Connnects to the database with supplied credentials and region.

__Arguments__

* `credentials` - an object with AWS credentials
* `region` - the region string you would like to use

__Example__

```javascript
var dynamaestro = require("dynamaestro");

var config = {
    credentials: {
        "accessKeyId" : "XXXXXXXXXXXXXXXXX",
        "secretAccessKey" : "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    },
    region : "us-west-1"
};

var ddb = new dynamaestro(config);
```

---------------------------------------

## Items

<!-- putItem -->
<a name="putItem"></a>

### putItem()

`putItem()` is a chained function with `table()`, `item()`, and `execute()` chains.
`putItem()` is used to create a single item from an object. This function will
handle all of the types currently(as of January 2015) available for AWS.

__Chained Methods__

* `table(tableName)`
	* __tableName__ - the name of the table that you'd like to scan
* `item(item)`
    * __item__ - the item object you would like to place on the table
* `allowOverwrite()`
    * by default, putItem will not overwrite an item as it is better to update,
    but this override will allow you to use putItem like update.
* `execute(callback)`
	* __callback__ - returned function with `error` and `response`

__Example__

```js

var now = new Date();

var testItem = {
    user : "username",
    created : now.getTime(),
    item_id : uuid.v4()
};

ddb.putItem()
    .table("testing3")
    .item(testItem)
    .execute(function(error, response) {
        ////handle(error, response);
    });
```

---------------------------------------

<!-- batchWriteItem -->
<a name="batchWriteItems"></a>

### batchWriteItems()

`batchWriteItems()` is a chained function with `table()`, `put()`, `del()`, `where()`, and `execute()`. `batchWriteItems()` is used to create and delete multiple items in one call.

__Chained Methods__

* `table(tableName)`
	* __tableName__ - the name of the table that you'd like to get an item from.
* `put(item)`
	* __item__ - the item object that you would like to put on the table.
* `del()`
	* No arguments, must be followed by one `.where(...)` for HASH, and another `.where(...)` for a HASH AND RANGE.
* `where(key, value, nextHash)`
	* __key__ - the key you would like to get
	* __value__ - the value of that key
    * __nextHash__ - (true | false) Lets the function know to move on to another
    HASH or HASH/RANGE set.
* `execute(callback)`
	* __callback__ - function with `error` and `response`

__Example__

```js
var now = new Date();

var testItem = {
	user: "username",
	item_id: "1234-b34c-998e",
	created: now.getTime()
};

ddb.batchWriteItems()
	.table("tableOne")
	.delete()
	.where("user", "bob")
	.where("item_id", "e313659e-c8ce-4e0c-8fc7-bf01fe514c05")
	.delete()
	.where("user", "boudrd", true)
	.where("item_id", "1fe8a751-7324-4642-8df9-d3a8a4595639")
	.put(testItem)
	.table("tableTwo")
	.put(testItem)
	.execute(function(error, response) {
		//handle(error, response);
	});
```

---------------------------------------

<!-- getItem -->
<a name="getItem"></a>

### getItem()

`getItem()` is a chained function with `table()`, `where()`, `select()`, and
`execute()` chains. `getItem()` is used get a specific item based off a HASH key,
and optionally a RANGE key.

__Chained Methods__

* `table(tableName)`
    * __tableName__ - the name of the table that you'd like to get an item from.
* `where(key, value)`
    * __key__ - the key you would like to get query by
    * __value__ - the value of that key
* `select(atrributes)`
    * __attributes__ - Optional: array of attributes you would like returned
* `execute(callback)`
    * __callback__ - function with `error` and `response`

__Examples__

___by HASH & RANGE:___

```js
ddb.getItem()
    .table("testing2")
    .where("user", "boudrd")
    .where("item_id", "592c7ec9-4835-4c88-9b5f-c09fe11ebf97")
    .execute(function(error, response) {
        //handle(error, response);
    });
```

___by HASH only:___

```js
ddb.getItem()
    .table("testing2")
    .where("item_id", "592c7ec9-4835-4c88-9b5f-c09fe11ebf97")
    .execute(function(error, response) {
        //handle(error, response);
    });
```

---------------------------------------

<!-- batchGetItem -->
<a name="batchGetItems"></a>

### batchGetItems()

`batchGetItems()` is a chained function with `table()`, `where()`, `select()`, and
`execute()` chains. `getItem()` is used get a specific item based off a HASH key,
and optionally a RANGE key.

__Chained Methods__

* `table(tableName)`
    * __tableName__ - the name of the table that you'd like to scan
* `where(key, value, nextHash)`
    * __key__ - the key you would like to get query by
    * __value__ - the value of that key
    * __nextHash__ - (true | false) Lets the function know to move on to another
    HASH or HASH/RANGE set.
* `select(atrributes)`
    * __attributes__ - Optional: array of attributes you would like returned
* `execute(callback)`
    * __callback__ - function with `error` and `response`

__Example__

```js
ddb.batchGetItems()
    .table("table1")
    .where("user", "username")
    .where("item_id", "018654bf-2a10-4b08-918c-f21b0ca3c204")
    .where("user", "username", true)
    .where("item_id", "23bb7b66-1801-4164-83c0-2a8259261905")
    .select(["user", "item_id"])
    .table("table2")
    .where("user", "username")
    .where("item_id", "1211f8fe-2567-44b6-83f0-f82650376a89")
    .execute(function(error, response) {
        //handle(error, response);
        cb();
    });
```

---------------------------------------

<!-- query -->
<a name="query"></a>

### query()

`query()` is a chained function with `table()`, `globalIndex()`, `where()`,
`select()`, and `execute()` chains. `query()` is used get a group of items based off
a HASH key. You can also specify a global index to query off a different index.

__Chained Methods__

* `table(tableName)`
    * __tableName__ - the name of the table that you'd like to scan
* `globalIndex(indexName)`
    * __indexName__ - _optional:_ name of the global index you would like to query
* `where(key, operator, value)`
    * __key__ - the key you would like to get query by
    * __operator__ - the comparison operator that you would like to compare the
    key and value.
        * Available Operators: EQ | NE | IN | LE | LT | GE | GT | BETWEEN |
        NOT_NULL | NULL | CONTAINS | NOT_CONTAINS | BEGINS_WITH
        * Note: not all attributes available all the time
    * __value__ - the value of that key
* `select(atrributes)`
    * __attributes__ - _optional:_ array of attributes you would like returned
* `execute(callback)`
    * __callback__ - function with `error` and `response`

__Examples__

___Standard query off HASH:___

```js
ddb.query()
    .table("testing3")
    .where("user", "EQ", "username")
    .execute(function(error, response) {
        //handle(error, response);
    });
```

___Global Index query:___

```js
ddb.query()
    .table("testing3")
    .globalIndex("indexName")
    .where("user", "EQ", "username")
    .where("created", "BETWEEN", ["1422048000000","1422049000000"])
    .execute(function(error, response) {
        //handle(error, response);
    });
```

---------------------------------------

<!-- scan -->
<a name="scan"></a>

### scan()

Scan is a chained function with `table()`, `select()`, and `execute()` chains. Scan
is used get the items of an entire database. Better to avoid using scan wherever
possible, and to use query instead.

__Chained Methods__

* `table(tableName)`
    * __tableName__ - the name of the table that you'd like to scan
* `select(atrributes)`
    * __attributes__ - Optional: array of attributes you would like returned
* `execute(callback)`
    * __callback__ - function with `error` and `response`

__Example__

```js
ddb.scan()
    .table("testing2")
    .select(["user","item_id"])
    .execute(function(error, response) {
        //handle(error, response);
    });
```

---------------------------------------

<!-- updateItem -->
<a name="updateItem"></a>

### updateItem()

`updateItem()` is a chained function with `table()`, `where()`, `put()`,
`increment()`, `delete()`, and `execute()` chains. `updateItem()` is used to update
a specific item. You can __put__ new keys, __put__ existing keys, __increment__
numbers and __delete__ existing keys.

__Chained Methods__

* `table(tableName)`
    * __tableName__ - the name of the table that you'd like to scan
* `where(key, value)`
    * __key__ - the key you would like to get query by
    * __value__ - the value of that key
* `put(key, value)`
    * __key__ - the key you would like to update
    * __value__ - the value of that key
* `increment(key, value)`
    * __key__ - the key you would like to increment
    * __value__ - the value that you would like to increment key by
* `delete(key)`
    * __key__ - the key you would like to delete
* `execute(callback)`
    * __callback__ - function with `error` and `response`

__Examples__

___by HASH only:___

```js
ddb.updateItem()
    .table("testing3")
    .where("id", "someId")
    .put("updated", now.getTime())
    .put("good", "stuff")
    .increment("numberOfThings", 50)
    .delete("someKey")
    .execute(function(error, response) {
        //handle(error, response);
    });
```

___by HASH & RANGE:___

```js
ddb.updateItem()
    .table("testing3")
    .where("user", "username")
    .where("item_id", "uniqueID")
    .put("updated", now.getTime())
    .put("good", "stuff")
    .increment("numberOfThings", 50)
    .delete("someKey")
    .execute(function(error, response) {
        //handle(error, response);
    });
```

---------------------------------------

<!-- deleteItem -->
<a name="deleteItem"></a>

### deleteItem()

`deleteItem()` is a chained function with `table()`, `where()`, and `execute()`.
`deleteItem()` is used to delete a specific item.

__Chained Methods__

* `table(tableName)`
    * __tableName__ - the name of the table that you'd like to scan
* `where(key, value)`
    * __key__ - the key you would like to delete an item in
    * __value__ - the value of that key
* `execute(callback)`
    * __callback__ - function with `error` and `response`

__Examples__

___by HASH only:___

```js
ddb.deleteItem()
    .table("testing3")
    .where("id", "someId")
    .execute(function(error, response) {
        //handle(error, response);
    });
```

___by HASH & RANGE:___

```js
ddb.deleteItem()
    .table("testing3")
    .where("user", "username")
    .where("item_id", "9d3063b8-2822-4bc7-a3ca-9af2ba8f1032")
    .execute(function(error, response) {
        //handle(error, response);
    });
```

---------------------------------------

## Tables

<!-- createTable -->
<a name="createTable"></a>

### createTable()

`createTable()` is a chained function with `table()`, `key()`, `provision()`, and `execute()`. `createTable()` is used to programatically create a table.

__Chained Methods__

* `table(tableName)`
    * __tableName__ - the name of the table that you'd like to create
* `key(type, value, keyType, indexType, indexName)`
    * __type__ - (string | number)
    * __value__ - name of the key
    * __keyType__ - (hash | range) Hash keys are mandatory, Range keys are optional.
    * __indexType__ - _optional:_ (global | local)
    * __indexName__ - _optional:_ Name of global or local index
* `provision(readCapacity, writeCapacity, indexType, indexName)`
	 * __readCapacity__ - Provisioned throughput capacity you want to reserve for reads.
	 * __writeCapacity__ - Provisioned throughput capacity you want to reserve for writes.
	 * __indexType__ - _optional:_ (global | local)
    * __indexName__ - _optional:_ Name of global or local index
* `execute(callback)`
    * __callback__ - function returned with `error` and `response`

__Example__

```js
ddb.createTable()
	.table("tableName")
	.key("string", "user", "hash")
	.key("string", "itemId", "range")
	.provision(5,5)
	.key("string", "user", "hash", "global", "byUserByDate")
	.key("string", "created", "range", "global", "byUserByDate")
	.provision(10, 10, "global", "byUserByDate")
	.key("string", "user", "hash", "local", "byUserByCount")
	.key("string", "count", "range", "local", "byUserByCount")
	.provision(5, 5)
	.execute(function(error, response) {
		//handle(error, response);
	});
```

---------------------------------------

<!-- listTables -->
<a name="listTables"></a>

### listTables(callback)

`listTables()` will return an array of table names.

__Arguments__

* `callback` - returned function with `error` and `response`

__Example__

```js
ddb.listTables(function(error, response) {
	//handle(error, response);
});
```

---------------------------------------

<!-- describeTable -->
<a name="describeTable"></a>

### describeTable(tableName, callback)

`describeTable()` is used to gather data about a table. Great for helping to
determine IF a table exists. If you need to create a table, you can check to
see if the table exists before you create it.

__Arguments__

* `tableName` - name of the table you want more information about
* `callback` - returned function with `error` and `response`

__Example__

```js
ddb.describeTable("testing3", function(error, response) {
    if(error && error.code === "ResourceNotFoundException") {
        // table doesn't exist
    } else {
        // table does exist
    }
});
```

---------------------------------------

<!-- deleteTable -->
<a name="deleteTable"></a>

### deleteTable(tableName, callback)

`deleteTable()` is used to delete a table.

__Arguments__

* `tableName` - name of the table you would like to delete
* `callback` - returned function with `error` and `response`

__Example__

```js
ddb.deleteTable("tableName", function(error, response) {
	//handle(error, response);
});
```

## Utilities

<!-- whenTableExists -->
<a name="whenTableExists"></a>

### whenTableExists(tableName, callback)

`whenTableExists()` is used to determine when (NOT IF) a table exists. This is useful
to wait to do something to a table that you've just created. The function
polls your database 20 times, checking every 25 seconds to see if the table exists
yet.

__Arguments__

* `tableName` - name of the table you are waiting for to exist
* `callback` - returned function with `error` and `response`

__Example__

```js
ddb.whenTableExists("testing3", function(error, response) {
    //handle(error, response);
});
```

---------------------------------------

<!-- whenTableDoesntExist -->
<a name="whenTableDoesntExist"></a>

### whenTableDoesntExist(tableName, callback)

`whenTableDoesntExist()` is used to determine when (NOT IF) a table no longer exists. This
is useful to wait to do something to a table that you've just deleted. The function
polls your database 20 times, checking every 25 seconds to see if the table still
exists.

__Arguments__

* `tableName` - name of the table you are waiting for to not exist
* `callback` - returned function with `error` and `response`

__Example__

```js
ddb.whenTableDoesntExist("testing3", function(error, response) {
    //handle(error, response);
});
```

---------------------------------------
