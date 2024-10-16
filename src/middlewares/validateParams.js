export const validateParams = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: 'BadRequestError',
      data: { message: 'Bad Request', errors: error.details },
    });
  }
  next();
};
