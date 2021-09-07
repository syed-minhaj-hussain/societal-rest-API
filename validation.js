const Joi = require("joi");

const loginValidation = (data) => {
  const joiSchema = Joi.object({
    email: Joi.string().email().min(5).max(30).required(),
    password: Joi.string().min(5).max(30).required(),
  });
  return joiSchema.validate(data);
};

const registerValidation = (data) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(5).max(30).required(),
    username: Joi.string().min(5).max(30).required(),
    email: Joi.string().email().min(5).max(30).required(),
    password: Joi.string().min(5).max(30),
    profilePicture: Joi.string(),
    coverPicture: Joi.string(),
    followers: Joi.array(),
    following: Joi.array(),
    description: Joi.string().max(50),
    location: Joi.string().max(50),
  });
  return joiSchema.validate(data);
};

const postValidation = (data) => {
  const joiSchema = Joi.object({
    user: Joi.string(),
    description: Joi.string().min(5).max(300),
    image: Joi.string(),
    likes: Joi.array(),
  });
  return joiSchema.validate(data);
};

module.exports = { loginValidation, registerValidation, postValidation };
