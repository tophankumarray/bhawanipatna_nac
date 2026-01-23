export const getTodayKey = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

export const calcSalesRate = (made, sold) => {
  if (!made || made <= 0) return 0;
  return Math.round((sold / made) * 100);
};
