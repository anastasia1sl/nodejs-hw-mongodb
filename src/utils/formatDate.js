export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const day = String(date.getDate()).padStart(2, '0'); // day
  const month = String(date.getMonth() + 1).padStart(2, '0'); // month
  const year = date.getFullYear(); // year

  const hours = String(date.getHours()).padStart(2, '0'); // hours
  const minutes = String(date.getMinutes()).padStart(2, '0'); // minutes
  const seconds = String(date.getSeconds()).padStart(2, '0'); // seconds

  // formating to format DD-MM-YY HH:MM:SS
  const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
}

export default formatDateTime;
