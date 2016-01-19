export function dateFromString(dateStr) {
  if (!dateStr) return undefined;
  const [year, month, day] = dateStr.split('-').map(x => parseInt(x, 10));
  return new Date(year, month - 1, day);
}

export function startOf({weekno, born}) {
  if (!born) throw Error("startOf func requires a 'born' date to work");

  const b = dateFromString(born);

  return new Date(
    b.getFullYear() + Math.floor(weekno / 52),
    b.getMonth(),
    b.getDate() + (weekno % 52) * 7
  );
}

export function endOf({weekno, born}) {
  return new Date(startOf({weekno: +weekno + 1, born}).getTime() - 86400000);
}

export function eventsForMonth(events, monthno) {
  return (events[monthno * 4    ] || []).concat( // eslint-disable-line no-multi-spaces
          events[monthno * 4 + 1] || []).concat(
          events[monthno * 4 + 2] || []).concat(
          events[monthno * 4 + 3] || []);
}

const months = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
};

export function shortDate(date) {
  const dateStr = typeof date === 'string'
    ? date
    : date.toISOString().replace(/T.+$/, '');
  let [year, month, day] = dateStr.split('-'); // eslint-disable-line prefer-const
  day = day.replace(/^0/, '');
  month = months[month];
  return `${day} ${month} ${year}`;
}
