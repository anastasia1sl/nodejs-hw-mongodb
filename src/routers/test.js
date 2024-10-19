import { json, Router } from 'express';
import { validateBody } from './../middlewares/validateBody.js';
import {
  addWaterSchema,
  dateSchema,
  monthSchema,
  updateWaterSchema,
} from '../validation/test.js';
import {
  addWaterController,
  dateWaterController,
  deleteWaterController,
  monthWaterController,
  updateWaterController,
  todayWaterController,
} from './../controllers/test.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

import { isValidIdTest } from './../middlewares/isValidIdTest.js';
import { validateParams } from '../middlewares/validateParams.js';

const testRouter = Router();
const jsonParser = json();

import { authenticate } from '../middlewares/authenticate.js';

testRouter.use(authenticate);

testRouter.post(
  '/',
  jsonParser,
  validateBody(addWaterSchema),
  ctrlWrapper(addWaterController),
);

testRouter.patch(
  '/:waterId',
  jsonParser,
  isValidIdTest('waterId'),
  validateBody(updateWaterSchema),
  ctrlWrapper(updateWaterController),
);

testRouter.delete(
  '/:waterId',
  jsonParser,
  isValidIdTest('waterId'),
  ctrlWrapper(deleteWaterController),
);

testRouter.get(
  '/day/:date',
  validateParams(dateSchema),
  ctrlWrapper(dateWaterController),
);

testRouter.get(
  '/month/:yearMonth',
  validateParams(monthSchema),
  ctrlWrapper(monthWaterController),
);

testRouter.get('/today', todayWaterController);

export default testRouter;
