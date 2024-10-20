import { TestCollection } from '../db/models/test.js';
import { UsersCollection } from '../db/models/user.js';

export const addWaterService = async (payload) =>
  await TestCollection.create(payload);

export const updateWaterService = async (
  waterId,
  userId,
  payload,
  options = {},
) => {
  const water = await TestCollection.findOneAndUpdate(
    {
      _id: waterId,
      userId,
    },
    payload,
    { new: true, includeResultMetadata: true, ...options },
  );

  return {
    data: water.value,
    isNew: Boolean(water?.lastErrorObject?.upserted),
  };
};

export const deleteWaterService = async (waterId, userId) => {
  const water = await TestCollection.findOneAndDelete({
    _id: waterId,
    userId,
  });

  return water;
};

export const getWaterByDateService = async (userId, date) => {
  const startOfDay = `${date}T00:00:00`;
  const endOfDay = `${date}T23:59:59`;

  const water = await TestCollection.find({
    userId,
    dateTime: { $gte: startOfDay, $lte: endOfDay },
  });

  return water;
};

export const getWaterForTodayService = async (userId) => {
  const today = new Date().toISOString().split('T')[0];
  return await getWaterByDateService(userId, today);
};

export const getmonthWaterService = async (userId, yearMonth) => {
  const startOfMonth = `${yearMonth}-01T00:00:00`;
  const endOfMonth = `${yearMonth}-31T23:59:59`;

  const water = await TestCollection.find({
    userId,
    dateTime: { $gte: startOfMonth, $lte: endOfMonth },
  });

  return water;
};

export const createDailyWaterArrayWithValues = async (userId, yearMonth) => {
  const user = await UsersCollection.findById(userId);
  const { dailyNorma: dailyNorm } = user; // Destructure dailyNorm from user

  const waterRecords = await getmonthWaterService(userId, yearMonth);
  const [year, month] = yearMonth.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();

  // Helper to format dates to "DD-MM-YYYYTHH:mm:ss" format
  const formatDate = (day) =>
    `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}T00:00:00`;

  // Generate daily water log array
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateKey = formatDate(day);

    // Filter records for the specific day
    const recordsForDay = waterRecords.filter((record) =>
      new Date(record.dateTime).toISOString().startsWith(dateKey.split('T')[0]),
    );

    const totalConsumed = recordsForDay.reduce(
      (sum, { value }) => sum + value,
      0,
    );
    const consumptionCount = recordsForDay.length;
    const percentageOfDailyNorm = Math.min(
      ((totalConsumed / dailyNorm) * 100).toFixed(2),
      100,
    );

    return {
      date: `${day} ${new Intl.DateTimeFormat('en-US', {
        month: 'long',
      }).format(new Date(year, month - 1))}`, // e.g., "5 April"
      dailyNorm: `${dailyNorm} L`,
      consumed: `${totalConsumed.toFixed(2)} L`,
      percentage: `${percentageOfDailyNorm}%`,
      consumptionCount,
    };
  });
};
