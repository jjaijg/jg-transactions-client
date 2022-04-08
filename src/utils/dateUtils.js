import { getMonth, format, isSameYear, addYears } from "date-fns";

export const getCurrentMonth = () => {
  const date = new Date();
  return {
    inNumber: getMonth(date),
    inWord: format(date, "MMM").toUpperCase(),
  };
};

export const getCurrentYear = () => {
  return format(new Date(), "yyyy");
};

export const getYears = (date) => {
  let dateHolder = new Date(date);
  const currentDate = new Date();
  let years = [];
  if (isSameYear(dateHolder, currentDate)) return [format(dateHolder, "yyyy")];

  while (!isSameYear(dateHolder, currentDate)) {
    years.push(format(dateHolder, "yyyy"));
    dateHolder = addYears(dateHolder, 1);
  }
  years.push(format(dateHolder, "yyyy"));
  return years;
};

export const formatDate = (date) => {
  const curDate = new Date(date);
  return format(curDate, "dd MMM, yyyy");
};

const dateUtils = {
  getCurrentMonth,
  getCurrentYear,
  getYears,
  formatDate,
};

export default dateUtils;
