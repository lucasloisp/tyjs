const map = new Map(
  Object.getOwnPropertyNames(Math)
    .filter((n) => typeof Math[n] === "function")
    .map((n) => [n, Math[n]])
);
map.set("pepe", (h) => h * 3);
map.set("pepe2", (h, j) => h * j);
map.set("pepe3", (h, j, i) => h * j * i);

module.exports = map;
