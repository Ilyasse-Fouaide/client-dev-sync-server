const badRequest = require("./badRequest");
const forbidden = require("./forbidden");
const notFound = require("./notFoundError");
const unAuthorized = require("./unAuthorized");

module.exports = {
  badRequest,
  notFound,
  unAuthorized,
  forbidden,
};
