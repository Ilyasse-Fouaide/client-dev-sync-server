const Error = require("../customError");

module.exports = (req, res, next) => {
  next(Error.notFound(`url ${req.url} Not Found!.`));
};
