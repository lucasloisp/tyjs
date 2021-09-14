const Type = require("./TypeChecker");

function tyjs(typeDescriptionParts, ...f) {
  if (!f.every((value) => typeof value === "function")) {
    throw new Error("Interpolated value is not a function");
  }
  let typeDescription = typeDescriptionParts
    .map((part, index) => {
      if (index === 0) {
        return part;
      } else {
        return `$${index - 1}${part}`;
      }
    })
    .join("");

  return new Type(typeDescription, f);
}

module.exports = tyjs;
