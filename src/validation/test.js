import Joi from 'joi';
const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

export const addWaterSchema = Joi.object({
  value: Joi.number().required().messages({
    'number.base': 'Value must be a number',
    'any.required': 'Value is required ',
  }),

  dateTime: Joi.string().pattern(isoDateTimeRegex).messages({
    'string.base': 'dateTime must be a string in foramt YYYY-MM-DDTHH:mm:ss',
    'any.required': 'dateTime is required ',
  }),
});

export const updateWaterSchema = Joi.object({
  value: Joi.number().messages({
    'number.base': 'Value must be a number',
  }),

  dateTime: Joi.string().pattern(isoDateTimeRegex).messages({
    'string.base': 'dateTime must be a string in foramt YYYY-MM-DDTHH:mm:ss',
  }),
});

export const dateSchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'date must be a string in foramt YYYY-MM-DD',
      'any.required': 'date is required',
    }),
});

export const monthSchema = Joi.object({
  yearMonth: Joi.string()
    .pattern(/^\d{4}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'yearMonth must be a string in foramt YYYY-MM',
      'any.required': 'yearMonth is required',
    }),
});
