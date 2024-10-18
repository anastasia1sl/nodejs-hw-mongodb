import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidWaterId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw createHttpError(400, 'Bad Request');
  }

  next();
};
