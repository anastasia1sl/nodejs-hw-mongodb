import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
// import { HTTP_STATUSES } from '../constants/test.js';

export const isValidIdTest =
  (idName = 'id') =>
  (req, res, next) => {
    const id = req.params[idName];

    if (!id) throw new Error('id is not provided in isValidId');

    if (!isValidObjectId(id))
      return next(
        createHttpError(
          `Invalid ID: '${id}' provided. Expected a valid 24-character MongoDB ObjectId.`,
        ),
      );

    return next();
  };

// import { isValidObjectId } from 'mongoose';
// import createHttpError from 'http-errors';

// export const isValidIdTest = (req, res, next) => {
//   const { id } = req.params;
//   if (!isValidObjectId(id)) {
//     throw createHttpError(400, 'Bad Request');
//   }

//   next();
// };
