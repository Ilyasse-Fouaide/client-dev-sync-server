const { ReasonPhrases, StatusCodes } = require("http-status-codes")
const CustomError = require("./customError")

const unAuthorized = (message) => {
  return new CustomError(message || ReasonPhrases.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
}

module.exports = unAuthorized;
