const CustomError = require('./customError');
const { StatusCodes } = require('http-status-codes');

const badRequest = (message) => {
  return new CustomError(message, StatusCodes.BAD_REQUEST);
};

module.exports = badRequest;
