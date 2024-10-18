import WaterCollection from '../db/models/water.js';
import { UsersCollection } from '../db/models/user.js';

export const addWaterDataService = async (userId, value, dateTime) => {
  const currentDateTime = dateTime || new Date().toLocaleString('en-GB');

  const waterRecord = await WaterCollection.create({
    userId,
    value,
    dateTime: currentDateTime,
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

export const getWaterByDayService = async (userId) => {
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const dailyNorma = user.dailyNorma;

  const currentDate = new Date();
  const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

  ////format date to  "MM/DD/YYYY, HH:mm:ss AM/PM"
  const startOfDayString = startOfDay.toLocaleString('en-GB');
  const endOfDayString = endOfDay.toLocaleString('en-GB');

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

// export const getWaterByDayService = async (userId, currentDate) => {
//   const user = await UsersCollection.findById(userId); /// find user of current session

//   if (!user || !user.dailyNorma) {
//     throw new Error('User not found or daily water goal is missing');
//   }

//   const dailyGoal = user.dailyNorma;

//   const waterRecords = await WaterCollection.find({
//     /// all records for current date
//     userId,
//     date: currentDate,
//   });

//   const totalWaterConsumed = waterRecords.reduce(
//     /// total water amount
//     (total, record) => total + record.value,
//     0,
//   );

//   const percentageOfDailyGoal = (totalWaterConsumed / dailyGoal) * 100; /// % math

//   return {
//     percentageOfDailyGoal,
//     waterRecords,
//   };
// };

//////////// ------------- working MONTH  but Too difficult -------------------------------------------------
export const getWaterByMonthService = async (userId, month, year) => {
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const dailyNorma = user.dailyNorma;

  // Преобразуем месяц и год в строковые значения
  const monthString = String(month).padStart(2, '0');
  const yearString = String(year);

  // Получаем записи о потреблении воды за месяц
  const waterRecords = await WaterCollection.find({
    userId,
    dateTime: {
      $regex: new RegExp(`^\\d{2}/${monthString}/${yearString}`), // Регулярное выражение для поиска записей за месяц
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
    )}/${monthString}/${yearString}`;
    dailyConsumption[formattedDate] = {
      totalWater: 0,
      count: 0,
    };
  }

  // Заполняем данные из записей о потреблении воды
  waterRecords.forEach((record) => {
    const [datePart] = record.dateTime.split(','); // Извлекаем часть с датой (DD/MM/YYYY)
    const formattedDate = datePart.trim();

    // Проверяем, что день уже инициализирован
    if (dailyConsumption[formattedDate]) {
      dailyConsumption[formattedDate].totalWater += record.value;
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

// /// ---------------------------- /////////////////////////

// const initializeDailyConsumption = (month, year) => {
//   const dailyConsumption = {};
//   const daysInMonth = new Date(year, month, 0).getDate();
//   const monthString = String(month).padStart(2, '0');

//   for (let day = 1; day <= daysInMonth; day++) {
//     const formattedDate = `${String(day).padStart(
//       2,
//       '0',
//     )}/${monthString}/${year}`;
//     dailyConsumption[formattedDate] = { totalWater: 0, count: 0 };
//   }

//   return dailyConsumption;
// };

// export const getWaterByMonthService = async (userId, month, year) => {
//   const user = await UsersCollection.findById(userId);
//   if (!user) throw new Error('User not found');

//   const dailyNorma = user.dailyNorma;
//   const monthString = String(month).padStart(2, '0');
//   const yearString = String(year);

//   // Получаем записи о потреблении воды за месяц
//   const waterRecords = await WaterCollection.find({
//     userId,
//     dateTime: {
//       $regex: new RegExp(`^\\d{2}/${monthString}/${yearString}`),
//     },
//   });

//   // Инициализируем объект с нулевыми значениями для каждого дня месяца
//   const dailyConsumption = initializeDailyConsumption(month, year);

//   // Заполняем данные из записей о потреблении воды
//   waterRecords.forEach((record) => {
//     const [datePart] = record.dateTime.split(','); // Извлекаем часть с датой (DD/MM/YYYY)
//     const formattedDate = datePart.trim();

//     if (dailyConsumption[formattedDate]) {
//       dailyConsumption[formattedDate].totalWater += record.value;
//       dailyConsumption[formattedDate].count += 1;
//     }
//   });

//   // Формируем результат
//   return Object.entries(dailyConsumption).map(
//     ([date, { totalWater, count }]) => {
//       const percentageOfGoal = (totalWater / dailyNorma) * 100;

//       return {
//         date,
//         dailyNorma: `${dailyNorma} L`,
//         percentageOfGoal: Math.min(percentageOfGoal, 100),
//         consumptionCount: count,
//         value: totalWater,
//       };
//     },
//   );
// };

//////////////////////////////////////////// ---------------------------------------------- test below

// export const addWaterDataService = async (payload) =>
//   await WaterCollection.create(payload);

// // export const addWaterDataService = async (userId, value, dateTime) => {
// //   const waterRecord = await WaterCollection.create({
// //     userId,
// //     amount: value,
// //     date: dateTime,
// //   });

// //   return waterRecord;
// // };

// export const editWaterService = async (
//   waterId,
//   userId,
//   payload,
//   options = {},
// ) => {
//   const water = await WaterCollection.findOneAndUpdate(
//     {
//       _id: waterId,
//       userId,
//     },
//     payload,
//     { new: true, includeResultMetadata: true, ...options },
//   );

//   return {
//     data: water.value,
//     isNew: Boolean(water?.lastErrorObject?.upserted),
//   };
// };

// export const deleteWaterService = async (waterId, userId) => {
//   const water = await WaterCollection.findOneAndDelete({
//     _id: waterId,
//     userId,
//   });

//   return water;
// };

// export const getWaterByDayService = async (userId, date) => {
//   // Форматування дати для запиту
//   const day = date.split('-')[0]; // Отримуємо день
//   const month = date.split('-')[1]; // Отримуємо місяць
//   const year = date.split('-')[2]; // Отримуємо рік

//   // Формуємо рядок дати у форматі 'DD/MM/YYYY'
//   const formattedDate = `${day}/${month}/${year}`;

//   // Отримуємо початок і кінець дня у форматі 'DD/MM/YYYY, HH:mm:ss'
//   const startOfDay = `${formattedDate}, 00:00:00`;
//   const endOfDay = `${formattedDate}, 23:59:59`;

//   console.log('Start of Day:', startOfDay); // Логування для дебагу
//   console.log('End of Day:', endOfDay); // Логування для дебагу

//   // Виконуємо запит до бази даних
//   const waterRecords = await WaterCollection.find({
//     userId,
//     dateTime: { $gte: startOfDay, $lte: endOfDay },
//   });

//   return waterRecords;
// };

// export const getWaterByMonthService = async (userId, date) => {
//   // date очікується у форматі 'YYYY-MM'
//   const [year, month] = date.split('-');
//   const monthString = String(month).padStart(2, '0'); // Форматування місяця до двох цифр

//   // Формуємо початок та кінець місяця
//   const startOfMonth = `01/${monthString}/${year}, 00:00:00`; // Перший день місяця
//   const endOfMonth = new Date(year, month, 0); // Останній день місяця
//   const lastDay = String(endOfMonth.getDate()).padStart(2, '0'); // Останній день у форматі двох цифр
//   const endOfMonthString = `${lastDay}/${monthString}/${year}, 23:59:59`; // Останній день з часом

//   console.log('Start of Month:', startOfMonth); // Логування для дебагу
//   console.log('End of Month:', endOfMonthString); // Логування для дебагу

//   // Виконуємо запит до бази даних
//   const waterRecords = await WaterCollection.find({
//     userId,
//     dateTime: { $gte: startOfMonth, $lte: endOfMonthString },
//   });

//   return waterRecords;
// };
