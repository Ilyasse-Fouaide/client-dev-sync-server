const notFound = require("../customError/notFoundError");

module.exports = (req, res, next) => {
  next(notFound(`url ${req.url} Not Found!.`));
};
