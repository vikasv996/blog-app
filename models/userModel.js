const config = require('../config.js').get(process.env.NODE_ENV);
const mongoUtil = require('../utils/mongoUtil');
const CONSTANT = require('../constant/constants');

module.exports.checkUser = function (emailId) {
    if (config.DEBUG) console.log(new Date().toISOString() + " userModel: checkUser ++");
    if (config.DEBUG) console.log(new Date().toISOString() + " userModel: checkUser --");
    return new Promise((resolve, reject) => {
        mongoUtil.getDatabase().collection(CONSTANT.COLLECTION_USER).findOne(
            {
                emailId
            },
            {
                projection: {
                    _id: 0,
                    userId: 1,
                    emailId: 1,
                    password: 1
                }
            })
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
};

module.exports.saveUser = function (userObject) {
    if (config.DEBUG) console.log(new Date().toISOString() + " userModel: saveUser ++");
    if (config.DEBUG) console.log(new Date().toISOString() + " userModel: saveUser --");
    return new Promise((resolve, reject) => {
        mongoUtil.getDatabase().collection(CONSTANT.COLLECTION_USER).insertOne(userObject)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
};

module.exports.checkUserByUserId = function (userId) {
    if (config.DEBUG) console.log(new Date().toISOString() + " userModel: checkUserByUserId ++");
    if (config.DEBUG) console.log(new Date().toISOString() + " userModel: checkUserByUserId --");
    return new Promise((resolve, reject) => {
        mongoUtil.getDatabase().collection(CONSTANT.COLLECTION_USER).findOne(
            {
                userId
            },
            {
                projection: {
                    _id: 0,
                    userId: 0
                    // emailId: 1,
                    // password: 1
                }
            })
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
};

