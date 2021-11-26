const JWT = require('jsonwebtoken');
const createError = require('http-errors');
// const redisClient = require('../utils/redisUtil');

module.exports.createAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId
        };
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: '1d',
            issuer: "Vikas Valechha"
        };
        JWT.sign(payload, secretKey, options, (err, token) => {
            if (err) {
                console.error("JWT sign error:", err);
                return reject(createError.InternalServerError());
            }

            resolve(token);
            /*redisClient.SET(userId, token, 'EX', 24 * 60 * 60, (err, reply) => {
                if (err) {
                    console.error("jwtUtils::redisClient:", err);
                    return reject(createError.InternalServerError());
                }
                resolve(token);
            });*/
        })
    })
}

module.exports.verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization'])
        return next(createError.Unauthorized());
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, payload) => {
        if (err) {
            if (err.name === "JsonWebTokenError") {
                return next(createError.Unauthorized());
            } else {
                return next(createError.Unauthorized(err.message));
            }
        }
        const userId = payload.userId;
        req.payload = payload;
        next();
        /*redisClient.GET(userId, (err, result) => {
            if (err) {
                console.error("verifyAccessToken::err", err);
                return next(createError.InternalServerError());
            }
            if (token === result) {
                req.payload = payload;
                next();
            } else {
                return next(createError.Unauthorized());
            }
        })*/
    })
}
