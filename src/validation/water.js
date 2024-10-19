import Joi from 'joi';

// export const createWaterSchema = Joi.object({
//   value: Joi.number().min(50).max(5000).required(),
//   dateTime: Joi.string()
//     .pattern(
//       /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}, (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
//     )
//     .messages({
//       'string.pattern.base':
//         'dateTime must be in the format DD/MM/YYYY, HH:mm:ss',
//       'any.required': 'dateTime is required',
//     }),
// });

// export const updateWaterSchema = Joi.object({
//   value: Joi.number().min(50).max(5000).required(),
//   dateTime: Joi.string()
//     .pattern(
//       /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}, (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
//     )
//     .required()
//     .messages({
//       'string.pattern.base':
//         'dateTime must be in the format DD/MM/YYYY, HH:mm:ss',
//       'any.required': 'dateTime is required',
//     }),
// });

export const monthSchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{1,2}-\d{4}$/) // Формат MM-YYYY
    .required()
    .messages({
      'string.pattern.base': 'Date must be in the format MM-YYYY',
      'any.required': 'Date is required',
    }),
});

/////// NEW
export const createWaterSchema = Joi.object({
  value: Joi.number().min(50).max(5000).required(),
  dateTime: Joi.string(),
});

export const updateWaterSchema = Joi.object({
  value: Joi.number().min(50).max(5000),
  dateTime: Joi.string(),
});
