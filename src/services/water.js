import WaterCollection from '../db/models/water.js';
import { UsersCollection } from '../db/models/user.js';

import formatDateTime from '../utils/formatDate.js';

export const addWaterDataService = async (payload) => {
  const water = await WaterCollection.create(payload);
  return water;
};

export const editWaterService = async (id, payload, userId) => {
  const water = await WaterCollection.findByIdAndUpdate(
    { _id: id, userId },
    payload,
    { new: true },
  );
  return water;
};

export const deleteWaterService = async (id) => {
  const waterRecord = await WaterCollection.findOneAndDelete({
    _id: id,
  });

  return waterRecord;
};

export const getAllRecords = () => WaterCollection.find();

export const getWaterTodayService = async (userId) => {
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const dailyNorma = user.dailyNorma;

  const currentDate = new Date();
  const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

  // formating to format DD-MM-YY HH:MM:SS
  const startOfDayString = formatDateTime(startOfDay);
  const endOfDayString = formatDateTime(endOfDay);

  const waterRecords = await WaterCollection.find({
    userId,
    dateTime: {
      $gte: startOfDayString,
      $lte: endOfDayString,
    },
  });

  const totalWaterConsumed = waterRecords.reduce(
    (total, record) => total + record.value,
    0,
  );

  const percentageOfGoal = (totalWaterConsumed / dailyNorma) * 100;

  return {
    records: waterRecords,
    percentageOfGoal: Math.min(percentageOfGoal, 100),
  };
};

export const getWaterByDateService = async (userId, date) => {
  const startOfDay = `${date} 00:00:00`;
  const endOfDay = `${date} 23:59:59`;

  const water = await WaterCollection.find({
    userId,
    dateTime: { $gte: startOfDay, $lte: endOfDay },
  });

  return water;
};

export const getWaterByMonthService = async (userId, month, year) => {
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const dailyNorma = user.dailyNorma;

  /// start and end of month
  const monthString = String(month).padStart(2, '0');
  const startOfMonth = `01-${monthString}-${year}`;
  const endOfMonth = `${new Date(
    year,
    month,
    0,
  ).getDate()}-${monthString}-${year}`;

  const waterRecords = await WaterCollection.find({
    userId,
    dateTime: {
      $gte: startOfMonth,
      $lte: `${endOfMonth} 23:59:59`,
    },
  });

  const dailyConsumption = {};

  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDate = `${String(day).padStart(
      2,
      '0',
    )}-${monthString}-${year}`;
    dailyConsumption[formattedDate] = {
      totalWater: 0,
      count: 0,
    };
  }

  // Заполняем данные из записей о потреблении воды
  waterRecords.forEach((record) => {
    const [datePart] = record.dateTime.split(' '); // Извлекаем часть с датой (DD-MM-YYYY)
    const formattedDate = datePart.trim();

    // Проверяем, что день уже инициализирован
    if (dailyConsumption[formattedDate]) {
      dailyConsumption[formattedDate].totalWater += record.value || 0;
      dailyConsumption[formattedDate].count += 1;
    }
  });

  // Формируем результат
  return Object.entries(dailyConsumption).map(
    ([date, { totalWater, count }]) => {
      const goalPercentage = (totalWater / dailyNorma) * 100;

      return {
        date,
        dailyNorma: `${dailyNorma} L`,
        goalPercentage: Math.min(goalPercentage, 100), // Процент не должен превышать 100%
        consumptionCount: count,
        value: totalWater, // Добавляем значение потребленной воды
      };
    },
  );
};
