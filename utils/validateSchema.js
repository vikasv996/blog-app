const Joi = require('joi');

const authSchema = Joi.object({
    emailId: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().trim().min(4).max(16).required()
})

const blogSchemaForAdd = Joi.object({
    title: Joi.string().trim().max(100).required(),
    description: Joi.string().trim().max(2000).required()
})

const blogSchemaForEdit = Joi.object({
    blogId: Joi.string().trim().guid({ version: 'uuidv4' }).required(),
    title: Joi.string().trim().max(100),
    description: Joi.string().trim().max(2000)
})

const blogSchemaForList = Joi.object({
    title: Joi.string().trim().max(100),
    description: Joi.string().trim().max(2000),
    skip: Joi.number().integer().max(20),
    limit: Joi.number().integer().max(20),
    sortBy: Joi.string().trim(),
    sortOrder: Joi.number().integer()
})

module.exports = {
    authSchema,
    blogSchemaForAdd,
    blogSchemaForEdit,
    blogSchemaForList
};
