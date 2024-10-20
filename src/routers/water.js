import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidWaterId } from '../middlewares/isValidWaterId.js';
import { validateParams } from '../middlewares/validateParams.js';

import {
  createWaterSchema,
  updateWaterSchema,
  monthSchema,
  dateSchema,
} from '../validation/water.js';
import {
  createWaterController,
  editWaterController,
  deleteWaterController,
  getWaterByDateController,
  getAllWaterByIdController,
  getWaterByMonthController,
  getWaterTodayController,
} from '../controllers/water.js';
import { authenticate } from '../middlewares/authenticate.js';

const waterRouter = Router();

waterRouter.use(authenticate);

waterRouter.post(
  '/',
  validateBody(createWaterSchema),
  ctrlWrapper(createWaterController),
);

waterRouter.patch(
  '/:id',
  isValidWaterId,
  validateBody(updateWaterSchema),
  ctrlWrapper(editWaterController),
);

waterRouter.delete('/:id', isValidWaterId, ctrlWrapper(deleteWaterController));

waterRouter.get('/', ctrlWrapper(getAllWaterByIdController));

waterRouter.get('/day', ctrlWrapper(getWaterTodayController));

waterRouter.get(
  '/month/:date',
  validateParams(monthSchema),
  ctrlWrapper(getWaterByMonthController),
);

waterRouter.get(
  '/day/:date',
  validateParams(dateSchema),
  ctrlWrapper(getWaterByDateController),
);

export default waterRouter;
