const { ReasonPhrases, StatusCodes } = require("http-status-codes")
const CustomError = require("./customError")

const unAuthorized = () => {
  return new CustomError(ReasonPhrases.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
}

module.exports = unAuthorized;
