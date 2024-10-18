const Error = require("../customError");

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') return next(Error.forbidden());
  next();
};

module.exports = adminMiddleware
