export function startOf({weekno, born}) {
  if (!born) throw Error("startOf func requires a 'born' date to work");

  const [year, month, day] = born.split('-').map(x => parseInt(x, 10));
  const b = new Date(year, month - 1, day);

  return new Date(
    b.getFullYear() + Math.floor(weekno / 52),
    b.getMonth(),
    b.getDate() + (weekno % 52) * 7
  );
}
