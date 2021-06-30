const Type = require("./TypeChecker");

function type([typeDescription]) {
  return new Type(typeDescription);
}

module.exports = {
  type,
};
