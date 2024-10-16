import createHttpError from 'http-errors';
import {
  addWaterDataService,
  editWaterService,
  deleteWaterService,
  getWaterByDayService,
  getWaterByMonthService,
} from '../services/water.js';

export const createWaterController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { value, date, time } = req.body;

    if (!value || !date || !time) {
      throw createHttpError(404, 'All fields are required');
    }

    const addedWater = await addWaterDataService(userId, value, date, time);

    res.status(201).json({
      status: 201,
      message: 'Successfully added water!',
      data: addedWater,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

export const editWaterController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const result = await editWaterService(id, userId, { ...req.body });

  if (result === null) {
    next(createHttpError(404, 'Data not found to update'));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully edit the water record!',
    data: result,
  });
};

export const deleteWaterController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const deletedWater = await deleteWaterService(id, userId);

  if (!deletedWater) {
    next(createHttpError(404, 'Data not found'));
  }
  res.status(200).send({ status: 200, data: { id } });
};

export const getWaterByDayController = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const currentDate = new Date().toISOString().split('T')[0]; // format YYYY-MM-DD

    const waterData = await getWaterByDayService(userId, currentDate);

    res.status(200).json({
      status: 200,
      message: 'Water consumption data retrieved successfully!',
      data: waterData,
    });
  } catch (error) {
    next(createHttpError(400, error.message));
  }
};

export const getWaterByMonthController = async (req, res, next) => {
  try {
    const userId = req.user._id; // user id for session token
    const [year, month] = req.params.date.split('-').map(Number); // for year in format 2024-10

    const waterData = await getWaterByMonthService(userId, month, year);

    res.status(200).json({
      status: 200,
      message: 'Water consumption data for the month retrieved successfully!',
      data: waterData,
    });
  } catch (error) {
    next(createHttpError(400, error.message)); // Обробка помилки
  }
};
