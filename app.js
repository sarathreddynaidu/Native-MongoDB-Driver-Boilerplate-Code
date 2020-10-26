const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const { Duplex } = require("stream");

const url = "mongodb://localhost:27017";

const dbName = "fruitsDB";

const client = new MongoClient(url, {useUnifiedTopology: true});

client.connect(function(err){
    assert.equal(null, err);
    console.log("Server successfully connected");
    const db = client.db(dbName);
    insertDocuments(db, function(){
        findDocuments(db, function(){
            client.close();
        });
    });
});


const insertDocuments = function(db, callback){
    const collection = db.collection("fruits");
    collection.insertMany([
        {
            name: "Apple",
            rating: 7
        },
        {
            name: "Orange",
            rating: 9
        },
        {
            name: "Banana",
            rating: 10
        }
    ], function(err, result){
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents");
        callback(result);
    });
};


const findDocuments = function(db, callback){
    const collection = db.collection("fruits");
    collection.find({}).toArray(function(err, fruits){
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(fruits);
        callback(fruits);
    });
}