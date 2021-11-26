const express = require('express');
const { v4: uuidv4 } = require('uuid');
const blogRouter = express.Router();
const createError = require('http-errors');
const jwtUtils = require('../utils/jwtUtils');
const blogModel = require("../models/blogModel");
const { blogSchemaForAdd, blogSchemaForEdit, blogSchemaForList } = require('../utils/validateSchema');

blogRouter.post('/add', jwtUtils.verifyAccessToken, async (req, res, next) => {
    try {
        const result = await blogSchemaForAdd.validateAsync(req.body);
        console.log("result:", result);
        const blogObj = {
            blogId: uuidv4(),
            userId: req.payload.userId,
            ...result,
            createdAt: new Date(),
            status: 'enable'
        };

        const blog = await blogModel.addBlog(blogObj);
        if (blog) {
            return res.send({
                code: 100,
                message: "Blog added successfully",
                blogId: blogObj.blogId
            });
        } else {
            throw createError.InternalServerError();
        }
    } catch (err) {
        next(err);
    }
})

blogRouter.post('/update', jwtUtils.verifyAccessToken, async (req, res, next) => {
    try {
        const result = await blogSchemaForEdit.validateAsync(req.body);

        const updated = await blogModel.updateBlog(result.blogId, result);
        if (updated && updated.value) {
            return res.send({
                code: 100,
                message: "Blog updated successfully"
            })
        } else {
            throw createError.InternalServerError();
        }
    } catch (err) {
        next(err);
    }
})

blogRouter.post('/list', jwtUtils.verifyAccessToken, async (req, res, next) => {
    try {
        const filterResult = await blogSchemaForList.validateAsync(req.body);
        let sortBy, sortOrder, skip, limit;
        let sortObject = {};

        const obj = {};
        if (filterResult.title) obj["title"] = { $regex: filterResult.title, $options: 'i' };
        if (filterResult.description) obj["description"] = { $regex: filterResult.description, $options: 'i' };
        obj["status"] = "enable";

        skip = filterResult.skip ? filterResult.skip : 0;
        limit = filterResult.limit ? filterResult.limit : 20;

        sortBy = filterResult.sortBy ? filterResult.sortBy : "_id";
        sortOrder = filterResult.sortOrder ? filterResult.sortOrder : 1;
        sortObject[sortBy] = sortOrder;

        let result = await blogModel.listBlogs(obj, skip, limit, sortObject);
        if (result && result.length > 0) {
            result = result[0];
            if (result.list.length > 0) {
                return res.json({
                    code: 100,
                    message: "Success",
                    ...result
                });
            } else {
                return res.json({
                    code: 110,
                    message: "No blogs found"
                });
            }
        } else {
            throw createError.InternalServerError();
        }

    } catch (err) {
        next(err);
    }
})

blogRouter.delete('/remove', jwtUtils.verifyAccessToken, async (req, res, next) => {
    try {
        const validatedResult = await blogSchemaForEdit.validateAsync(req.body);

        const blogRemoved = await blogModel.deleteBlog(validatedResult.blogId);
        if (blogRemoved && blogRemoved.value) {
            return res.json({
                code: 100,
                message: "Blog removed successfully"
            });
        } else {
            throw createError.NotFound("Blog not found / deleted");
        }
    } catch (err) {
        console.error("err:, ", err);
        next(err);
    }
})

module.exports = blogRouter;
