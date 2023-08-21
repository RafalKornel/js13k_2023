function KeyGenerator() {
  let i = 0;

  const getKey = () => {
    return `${i++}`;
  };

  return { getKey };
}

export const { getKey } = KeyGenerator();
