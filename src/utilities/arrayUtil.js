export const subArrays = (array, count = 12) => {
  const groups = Math.ceil(array.length / count);
  return [...Array(groups).keys()].map((i) =>
    array.slice(count * i, count * i + count)
  );
};
