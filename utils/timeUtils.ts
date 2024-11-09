export function getWeekStartDate():Date {
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getUTCDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

export const daysAgo = (n: number) => new Date(new Date().setDate(new Date().getDate() - n));
