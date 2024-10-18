import createHttpError from 'http-errors';
import {
  addWaterDataService,
  editWaterService,
  deleteWaterService,
  getWaterByDayService,
  getWaterByMonthService,
} from '../services/water.js';

export const createWaterController = async (req, res) => {
  const userId = req.user._id;
  const { value } = req.body;

  try {
    const newWaterRecord = await addWaterDataService(userId, value);
    res.status(201).json({
      status: 201,
      message: 'Successfully added water!',
      data: newWaterRecord,
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

export const getWaterByDayController = async (req, res) => {
  //// get water by day *today

  const userId = req.user.id;

  try {
    const waterData = await getWaterByDayService(userId);
    res.status(200).json({
      success: true,
      data: waterData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `'Error fetching water data:' ${error.message}`,
    });
  }
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
