module.exports = convertVariant = (storage) => {
  const deviceSpecs = storage
    .split(", ")
    .map((spec) => spec.replace("GB", "").replace("TB", "000"));

  const variants = deviceSpecs.map((spec) => {
    const [rom, ram] = spec.split(" ");
    return { ROM: parseInt(rom), RAM: parseInt(ram), price: 0 };
  });

  return variants;
};
