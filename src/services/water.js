import WaterCollection from '../db/models/water.js';
import { UsersCollection } from '../db/models/user.js';

import { formatDateTime } from '../controllers/water.js';

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

export const getWaterByDayService = async (userId) => {
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const dailyNorma = user.dailyNorma;

  const currentDate = new Date();
  console.log(currentDate);
  const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
  console.log(startOfDay);
  const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
  console.log(endOfDay);

  /// formating to  "MM/DD/YYYY, HH:mm:ss"
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

export const getWaterByMonthService = async (userId, month, year) => {
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const dailyNorma = user.dailyNorma;

  // Формируем начало и конец месяца в строковом формате
  const monthString = String(month).padStart(2, '0');
  const startOfMonth = `01-${monthString}-${year}`;
  const endOfMonth = `${new Date(
    year,
    month,
    0,
  ).getDate()}-${monthString}-${year}`;

  // Получаем записи о потреблении воды за месяц на основе диапазона строк
  const waterRecords = await WaterCollection.find({
    userId,
    dateTime: {
      $gte: startOfMonth, // начиная с начала месяца
      $lte: `${endOfMonth} 23:59:59`, // до конца месяца (включая время)
    },
  });

  // Создаем объект для хранения данных по дням
  const dailyConsumption = {};

  // Получаем количество дней в месяце
  const daysInMonth = new Date(year, month, 0).getDate();

  // Инициализируем объект с нулевыми значениями для каждого дня месяца
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
