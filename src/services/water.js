import WaterCollection from '../db/models/water.js';
import { UsersCollection } from '../db/models/user.js';

export const addWaterDataService = async (userId, value, date, time) => {
  const waterRecord = await WaterCollection.create({
    userId,
    value,
    date,
    time,
  });

  return waterRecord;
};

export const editWaterService = (id, userId, userData) => {
  return WaterCollection.findOneAndUpdate({ _id: id, userId }, userData, {
    new: true,
  });
};

export const deleteWaterService = (id, userId) => {
  return WaterCollection.findOneAndDelete({
    _id: id,
    userId,
  });
};

export const getWaterByDayService = async (userId, currentDate) => {
  const user = await UsersCollection.findById(userId); /// find user of current session

  if (!user || !user.dailyNorma) {
    throw new Error('User not found or daily water goal is missing');
  }

  const dailyGoal = user.dailyNorma;

  const waterRecords = await WaterCollection.find({
    /// all records for current date
    userId,
    date: currentDate,
  });

  const totalWaterConsumed = waterRecords.reduce(
    /// total water amount
    (total, record) => total + record.value,
    0,
  );

  const percentageOfDailyGoal = (totalWaterConsumed / dailyGoal) * 100; /// % math

  return {
    percentageOfDailyGoal,
    waterRecords,
  };
};

export const getWaterByMonthService = async (userId, month, year) => {
  const user = await UsersCollection.findById(userId); //// user for current session

  if (!user || !user.dailyNorma) {
    throw new Error('User not found or daily water goal is missing');
  }

  const dailyGoal = user.dailyNorma;

  const startDate = new Date(year, month - 1, 1); // start of the month
  const endDate = new Date(year, month, 0); // end of the month

  const waterRecords = await WaterCollection.find({
    /// find all reconds from start till end of the month

    userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  console.log(waterRecords);

  const dailyConsumption = {}; /// daily water intake

  waterRecords.forEach((record) => {
    const date = record.date.toISOString().split('T')[0]; // Формат дати без часу
    if (!dailyConsumption[date]) {
      dailyConsumption[date] = { total: 0, count: 0 }; // Ініціалізуємо день
    }
    dailyConsumption[date].total += record.value; // Додаємо кількість спожитої води
    dailyConsumption[date].count += 1; // Збільшуємо лічильник
  });

  // Обчислити дані для відповіді
  const consumptionData = Object.keys(dailyConsumption).map((date) => {
    const totalConsumed = dailyConsumption[date].total;
    const consumptionCount = dailyConsumption[date].count;

    // Форматування дати
    const dateObj = new Date(date);
    const formattedDate = `${dateObj.getDate()}, ${dateObj.toLocaleString(
      'default',
      { month: 'long' },
    )}`;

    return {
      date: formattedDate,
      dailyNorm: `${(dailyGoal / 1000).toFixed(1)} L`, // Денна норма в літрах (поділ на 1000)
      percentageOfDailyGoal: `${((totalConsumed / dailyGoal) * 100).toFixed(
        1,
      )}%`, // Відсоток споживання
      consumptionCount: consumptionCount, // Кількість споживань
    };
  });

  return consumptionData;
};
