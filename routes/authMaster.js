const express = require('express');
const { v4: uuidv4 } = require('uuid');
const authRouter = express.Router();
const createError = require('http-errors');
const userModel = require("../models/userModel");
const genUtils = require("../utils/GenUtils");
const jwtUtils = require('../utils/jwtUtils');
// const redisClient = require('../utils/redisUtil');
const { authSchema } = require('../utils/validateSchema');

authRouter.post('/register', async (req, res, next) => {

    try {
        // const {emailId, password} = req.body;

        // if (!emailId || !password)
        //     throw createError.BadRequest();

        const validatedResult = await authSchema.validateAsync(req.body);
        const userExist = await userModel.checkUser(validatedResult.emailId);
        if (userExist) {
            throw createError.Conflict(`${validatedResult.emailId} is already registered`);
        }

        const pwd = await genUtils.encryptPwd(validatedResult.password);

        const userObject = {
            userId: uuidv4(),
            emailId: validatedResult.emailId,
            password: pwd
        };

        const result = await userModel.saveUser(userObject);
        if (result) {
            // const accessToken = await jwtUtils.createAccessToken(userObject.userId);
            // return res.send({accessToken});
            return res.json({
                code: 100,
                message: "User registered successfully"
            });
        } else {
            throw createError.InternalServerError();
        }
    } catch (err) {
        // console.log(err);
        // return res.send('User register error');
        if (err.isJoi) err.status = 422;
        next(err);
    }

})

authRouter.post('/login', async (req, res, next) => {
    try {

        const validatedResult = await authSchema.validateAsync(req.body);
        console.log(validatedResult);
        const userExist = await userModel.checkUser(validatedResult.emailId);
        if (!userExist) {
            return createError.NotFound(`User: ${validatedResult.emailId} not registered`);
        }

        const isMatch = await genUtils.checkPwd(validatedResult.password, userExist.password);
        if (!isMatch)
            return createError.Unauthorized('Email / Password not valid');
        const accessToken = await jwtUtils.createAccessToken(userExist.userId);

        return res.send({
            code: 100,
            message: "Logged in",
            accessToken
        });

    } catch (err) {
        if (err.isJoi) {
            return next(createError.BadRequest('Invalid Email / Password'));
        }
        next(err);
    }
})

authRouter.delete('/logout', jwtUtils.verifyAccessToken, async (req, res, next) => {
    try {
        const { userId } = req.payload;
        const userExist = await userModel.checkUserByUserId(userId);
        if (!userExist) {
            throw createError.NotFound(`User not found`);
        }

        return res.json({
            code: 100,
            message: "Logged out successfully"
        });
        /*redisClient.DEL(userId, (err, val) => {
            if (err) {
                console.error("logout error:", err);
                throw createError.InternalServerError();
            }
            return res.json({
                code: 100,
                message: "Logged out successfully"
            });
        })*/
    } catch (err) {
        next(err);
    }
})

module.exports = authRouter;
