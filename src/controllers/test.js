import createHttpError from 'http-errors';
import {
  addWaterService,
  deleteWaterService,
  //   getmonthWater,
  getWaterByDateService,
  updateWaterService,
  getWaterForTodayService,
  createDailyWaterArrayWithValues,
} from '../services/test.js';

// export const addWaterController = async (req, res, next) => {
//   const value = req.body.value;
//   const dateTime = req.body.dateTime;
//   const userId = req.user._id;

//   const water = await addWater({ value, dateTime, userId });

//   res.status(200).json({
//     status: 200,
//     message: 'Water added successfully',
//     data: water,
//   });
// };

export const addWaterController = async (req, res, next) => {
  const value = req.body.value;
  const userId = req.user._id;

  const dateTime = req.body.dateTime || new Date().toISOString().split('.')[0];

  try {
    const water = await addWaterService({ value, dateTime, userId });

    res.status(200).json({
      status: 200,
      message: 'Water added successfully',
      data: water,
    });
  } catch (error) {
    return next(createHttpError.error(`Failed to add water: ${error.message}`));
  }
};

export const updateWaterController = async (req, res, next) => {
  const { waterId } = req.params;
  const userId = req.user._id;
  const value = req.body.value;
  const dateTime = req.body.time;

  const water = await updateWaterService(waterId, userId, { value, dateTime });

  if (!water) {
    return next(createHttpError.NotFound('Water not found'));
  }

  const status = water?.isNew ? 201 : 200;

  res.status(status).json({
    status: status,
    message: 'Water successfully updated',
    data: water,
  });
};

export const deleteWaterController = async (req, res, next) => {
  const { waterId } = req.params;
  const userId = req.user._id;

  const water = await deleteWaterService(waterId, userId);

  if (!water) {
    return next(createHttpError.NotFound('Water not found'));
  }

  res.status(200).send({ status: 200, data: { waterId } });
};

export const dateWaterController = async (req, res, next) => {
  const { date } = req.params;
  const userId = req.user._id;

  const waterByDate = await getWaterByDateService(userId, date);

  if (!waterByDate) {
    return next(createHttpError.NotFound(`Water not found by date ${date}`));
  }

  res.status(200).json({
    status: 200,
    message: 'Water by date found successfully',
    date: waterByDate,
  });
};

export const todayWaterController = async (req, res, next) => {
  const userId = req.user._id;

  const waterForToday = await getWaterForTodayService(userId);

  if (!waterForToday || waterForToday.length === 0) {
    return next(createHttpError.NotFound(`No water records found for today`));
  }

  res.status(200).json({
    status: 200,
    message: 'Water records for today found successfully',
    date: waterForToday,
  });
};

// export const monthWaterController = async (req, res, next) => {
//   const { yearMonth } = req.params;
//   const userId = req.user._id;

//   const waterByDateMonth = await getmonthWater(userId, yearMonth);
//   if (!waterByDateMonth) {
//     return next(
//       createHttpError.NotFound(`Water not found by month ${yearMonth}`),
//     );
//   }

//   res.status(200).json({
//     status: 200,
//     message: 'Water by month found successfully',
//     date: waterByDateMonth,
//   });
// };

export const monthWaterController = async (req, res, next) => {
  const { yearMonth } = req.params;
  const userId = req.user._id;

  const dailyWaterArray = await createDailyWaterArrayWithValues(
    userId,
    yearMonth,
  );

  res.status(200).json({
    status: 200,
    message: 'Water by month found successfully',
    date: dailyWaterArray,
  });
};
