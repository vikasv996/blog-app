const mongoClient = require('mongodb').MongoClient;
const config = require('../config.js').get(process.env.NODE_ENV);
const CONSTANT = require('../constant/constants');
let databaseGlobal;

module.exports.connectToServer = (callback) => {

    mongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true })
        .then(client => {
            if (config.DEBUG) console.log("Connected correctly to server");
            databaseGlobal = client.db(config.dbName);
            blogCollection();
            userCollection();

            // sessionCollection();
            // sessionHistoryCollection();
            return callback(null);
        })
        .catch(err => {
            return callback(err);
        })
};

function userCollection() {
    databaseGlobal.collection(CONSTANT.COLLECTION_USER, { strict: true }, function (err, collection) {
        if (config.DEBUG) console.log("COLLECTION_USER ++");
        if (err) {// collection does NOT exists
            if (config.DEBUG) console.log("Users collection error : " + err);
            //create the collection and then index
            databaseGlobal.createCollection(CONSTANT.COLLECTION_USER, function (err, userCol) {
                if (config.DEBUG) console.log("Create COLLECTION_USER ++");
                if (err) {
                    if (config.DEBUG) console.log('Error creating users collection');
                } else if (userCol) {
                    userCol.createIndexes([
                        {
                            key: {
                                userId: 1
                            },
                            unique: true,
                            background: true
                        },
                        {
                            key: {
                                emailId: 1
                            },
                            unique: true,
                            background: true
                        }
                    ]);
                    if (config.DEBUG) console.log("Create COLLECTION_USER Indexes --");
                }
                if (config.DEBUG) console.log("Create COLLECTION_USER --");
            });
        } else if (collection) { // collection exists
            if (config.DEBUG) console.log("Users collection: " + collection.namespace)
        }
        if (config.DEBUG) console.log("COLLECTION_USER --");
    });
}

function blogCollection() {
    databaseGlobal.collection(CONSTANT.COLLECTION_BLOG, { strict: true }, function (err, collection) {
        if (config.DEBUG) console.log("COLLECTION_BLOG ++");
        if (err) {// collection does NOT exists
            if (config.DEBUG) console.log("Blogs collection error : " + err);
            //create the collection and then index
            databaseGlobal.createCollection(CONSTANT.COLLECTION_BLOG, function (err, blogCol) {
                if (config.DEBUG) console.log("Create COLLECTION_BLOG ++");
                if (err) {
                    if (config.DEBUG) console.log('Error creating blogs collection');
                } else if (blogCol) {
                    blogCol.createIndexes([
                        {
                            key: {
                                blogId: 1
                            },
                            unique: true,
                            background: true
                        }
                    ]);
                    if (config.DEBUG) console.log("Create COLLECTION_BLOG Indexes --");
                }
                if (config.DEBUG) console.log("Create COLLECTION_BLOG --");
            });
        } else if (collection) { // collection exists
            if (config.DEBUG) console.log("Blogs collection: " + collection.namespace)
        }
        if (config.DEBUG) console.log("COLLECTION_BLOG --");
    });
}

module.exports.getDatabase = function () {
    return databaseGlobal;
};

