import createHttpError from 'http-errors';
import {
  addWaterDataService,
  editWaterService,
  deleteWaterService,
  getAllRecords,
  getWaterTodayService,
  getWaterByMonthService,
  getWaterByDateService,
} from '../services/water.js';

import { formatDateTime } from '../utils/formatDate.js';

export const createWaterController = async (req, res, next) => {
  const { value, dateTime } = req.body;
  const userId = req.user._id;

  if (!value) {
    return next(createHttpError(400, 'Required fields are missing'));
  }

  const currentDate = new Date();

  const dateToUse = dateTime ? dateTime : formatDateTime(currentDate);

  const waterRecord = await addWaterDataService({
    value,
    dateTime: dateToUse,
    userId,
  });

  res.status(201).json({
    status: 201,
    message: 'Water record created successfully!',
    data: waterRecord,
  });
};

export const editWaterController = async (req, res, next) => {
  const { id } = req.params;

  const result = await editWaterService(id, {
    ...req.body,
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};

export const deleteWaterController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const waterToDelete = await deleteWaterService(id, userId);

  if (!waterToDelete) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).send({ status: 200, data: { id } });
};

export const getAllWaterByIdController = async (req, res) => {
  const waterRecords = await getAllRecords({
    userId: req.user._id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: waterRecords,
  });
};

export const getWaterTodayController = async (req, res) => {
  const userId = req.user.id;

  try {
    const waterData = await getWaterTodayService(userId);
    res.status(200).json({
      success: true,
      data: waterData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error fetching water data: ${error.message}`,
    });
  }
};

export const getWaterByDateController = async (req, res, next) => {
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

export const getWaterByMonthController = async (req, res) => {
  try {
    const userId = req.user._id;

    const { date } = req.params;
    const [month, year] = date.split('-').map(Number);

    const data = await getWaterByMonthService(userId, month, year);

    return res.status(200).json({
      status: 200,
      message: 'Water consumption data per month retrieved successfully!',
      data: data,
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
