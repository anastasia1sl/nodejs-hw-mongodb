import Joi from 'joi';

export const createWaterSchema = Joi.object({
  value: Joi.number().min(50).max(5000).required().messages({
    'number.base': 'Value must be a number',
    'any.required': 'Value is required ',
  }),
  dateTime: Joi.string().messages({
    'string.base': 'dateTime must be a string in foramt YYYY-MM-DDTHH:mm:ss',
    'any.required': 'dateTime is required ',
  }),
});

export const updateWaterSchema = Joi.object({
  value: Joi.number().min(50).max(5000).required().messages({
    'number.base': 'Value must be a number',
    'any.required': 'Value is required ',
  }),
  dateTime: Joi.string().messages({
    'string.base': 'dateTime must be a string in foramt YYYY-MM-DDTHH:mm:ss',
    'any.required': 'dateTime is required ',
  }),
});

export const dateSchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{2}-\d{2}-\d{4}$/) // Формат DD-MM-YYYY
    .required()
    .messages({
      'string.pattern.base': 'Date must be in the format MM-YYYY',
      'any.required': 'Date is required',
    }),
});

export const monthSchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{1,2}-\d{4}$/) // Формат MM-YYYY
    .required()
    .messages({
      'string.pattern.base': 'Date must be in the format MM-YYYY',
      'any.required': 'Date is required',
    }),
});
