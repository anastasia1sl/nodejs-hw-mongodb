import Joi from 'joi';

export const createWaterSchema = Joi.object({
  value: Joi.number().min(50).max(5000).required(),
  date: Joi.date().required(),
  time: Joi.string()
    .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/) // Regex for HH:mm format
    .required(),
});

export const updateWaterSchema = Joi.object({
  value: Joi.number().min(50).max(5000),
  date: Joi.date().required(true),
  time: Joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/),
});

export const dateSchema = Joi.object({
  date: Joi.date().required().messages({
    'date.base': 'Date must be a valid date',
    'any.required': '"date" is required',
  }),
});

export const monthSchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}$/) /// date format validation YYYY-MM
    .required(),
});
