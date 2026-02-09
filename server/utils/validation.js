const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin') // Optional, defaults to user
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const eventSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    date: Joi.date().required(),
    location: Joi.string().required(),
    category: Joi.string(),
    image_url: Joi.string()
});

const productSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().integer().min(0),
    category: Joi.string(),
    image_url: Joi.string()
});

module.exports = {
    registerSchema,
    loginSchema,
    eventSchema,
    productSchema
};
