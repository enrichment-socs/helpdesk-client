export const DateHelper = {
  roundUpHours(date: Date) {
    const newDate = date;
    newDate.setHours(date.getHours() + 1);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    return newDate;
  },
};
