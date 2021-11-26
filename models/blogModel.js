const config = require('../config.js').get(process.env.NODE_ENV);
const mongoUtil = require('../utils/mongoUtil');
const CONSTANT = require('../constant/constants');

module.exports.addBlog = function (blogObject) {
    if (config.DEBUG) console.log(new Date().toISOString() + " blogModel: addBlog ++");
    if (config.DEBUG) console.log(new Date().toISOString() + " blogModel: addBlog --");
    return new Promise((resolve, reject) => {
        mongoUtil.getDatabase().collection(CONSTANT.COLLECTION_BLOG).insertOne(blogObject)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
};

module.exports.updateBlog = function (blogId, blogObject) {
    if (config.DEBUG) console.log(new Date().toISOString() + " blogModel: updateBlog ++");
    if (config.DEBUG) console.log(new Date().toISOString() + " blogModel: updateBlog --");
    return new Promise((resolve, reject) => {
        mongoUtil.getDatabase().collection(CONSTANT.COLLECTION_BLOG).findOneAndUpdate(
            {
                blogId
            },
            {
                $set: blogObject
            },
            {
                projection: {
                    _id: 0,
                    blogId: 1
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

module.exports.listBlogs = function (filterObj, skip, limit, sortObject) {
    if (config.DEBUG) console.log(new Date().toISOString() + " blogModel: listBlogs ++");
    if (config.DEBUG) console.log(new Date().toISOString() + " blogModel: listBlogs --");
    return new Promise((resolve, reject) => {
        mongoUtil.getDatabase().collection(CONSTANT.COLLECTION_BLOG).aggregate(
            [
                {
                    $facet: {
                        totalCount: [
                            {
                                $match: filterObj
                            },
                            {
                                $count: "count"
                            }
                        ],
                        list: [
                            {
                                $match: filterObj
                            },
                            {
                                $lookup: {
                                    from: CONSTANT.COLLECTION_USER,
                                    localField: 'userId',
                                    foreignField: 'userId',
                                    as: 'user'
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    createdBy: { $arrayElemAt: ['$user.emailId', 0] },
                                    blogId: 1,
                                    title: 1,
                                    description: 1,
                                    createdAt: 1
                                }
                            },
                            {
                                $skip: skip
                            },
                            {
                                $limit: limit
                            },
                            {
                                $sort: sortObject
                            }
                        ]
                    }
                },
                {
                    $addFields: {
                        totalCount: { $arrayElemAt: ["$totalCount.count", 0] }
                    }
                }
            ])
            .toArray()
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
};

module.exports.deleteBlog = function (blogId) {
    if (config.DEBUG) console.log(new Date().toISOString() + " blogModel: deleteBlog ++");
    if (config.DEBUG) console.log(new Date().toISOString() + " blogModel: deleteBlog --");
    return new Promise((resolve, reject) => {
        mongoUtil.getDatabase().collection(CONSTANT.COLLECTION_BLOG).findOneAndUpdate(
            {
                blogId,
                status: 'enable'
            },
            {
                $set: {
                    status: 'disable'
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
