export const addElipsis = (text = "", chars = 150) =>
  text.length > chars ? `${text.substring(0, chars - 3)}...` : text;

export const calcUsagePercent = (planned, actual) => {
  const usage = actual / planned;
  if (planned === 0) return "Not yet planned!";
  return isNaN(usage) || !isFinite(usage)
    ? ` 0 % `
    : ` ${Math.floor(usage * 100).toFixed(2)} %`;
};

export const usageFeedbackColor = (planned = 0, actual = 0) => {
  if (planned === 0) return "info";

  const usedPercent = parseFloat(
    Math.floor((actual / planned) * 100).toFixed(2)
  );
  console.log(actual, planned, usedPercent);

  if (usedPercent <= 60) return "success";
  if (usedPercent <= 90) return "warning";
  if (usedPercent >= 91) return "error";
};
