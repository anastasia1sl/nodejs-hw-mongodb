// import { Router } from 'express';
// import ctrlWrapper from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';

// const vodaRouter = Router();

// vodaRouter.use(authenticate);

import express from 'express';

import {
  createWaterController,
  getWaterByIdController,
  updateWaterController,
  deleteWaterController,
  getWaterPerDayController,
  getWaterPerMonthController,
} from '../controllers/voda.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';

import { createWaterSchema, updateWaterSchema } from '../validation/voda.js';
import { isValidDay } from '../middlewares/isValidVodaDay.js';
import { isValidMonth } from '../middlewares/isValidVodaMonth.js';

const vodaRouter = express.Router();
const jsonParser = express.json();

vodaRouter.use(authenticate);

vodaRouter.post(
  '/',
  jsonParser,
  validateBody(createWaterSchema),
  ctrlWrapper(createWaterController),
);
vodaRouter.get('/:id', isValidId, ctrlWrapper(getWaterByIdController));

vodaRouter.patch(
  '/:id',
  jsonParser,
  validateBody(updateWaterSchema),
  // isValidId,
  ctrlWrapper(updateWaterController),
);
vodaRouter.delete('/:id', ctrlWrapper(deleteWaterController));

// isValidId
vodaRouter.get(
  '/per-day/:date',
  isValidDay,
  ctrlWrapper(getWaterPerDayController),
);

vodaRouter.get(
  '/per-month/:date',
  isValidMonth,
  ctrlWrapper(getWaterPerMonthController),
);

export default vodaRouter;
