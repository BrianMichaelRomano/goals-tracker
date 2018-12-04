const daysInMonth = {
  'january': 31,
  'febuary': 28,
  'march': 31,
  'april': 30,
  'may': 31,
  'june': 30,
  'july': 31,
  'august': 31,
  'septemper': 30,
  'october': 31,
  'november': 30,
  'december': 31,
};

function getDaysInMonth(month, year) {
  const isLeapYear = checkLeapYear(year);

  if (isLeapYear) {
    daysInMonth['febuary'] = 29;
  }

  const monthArray = Object.keys(daysInMonth);
  let monthString = month;
  let numOfDays;

  if (typeof month == 'number') {
    monthString = monthArray[month - 1];
  }

  numOfDays = daysInMonth[monthString];
  return numOfDays;
};

function checkLeapYear(year) {

  if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
    return true
  }
  return false;
};