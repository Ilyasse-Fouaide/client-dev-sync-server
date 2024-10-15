const { StatusCodes } = require("http-status-codes");

module.exports = (err, req, res, next) => {
  if (err.status == 404) {
    return res.status(err.status).json({ message: err.message, status: err.status });
  };

  if (err.name && err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(({ path, message }) => {
      return { [path]: message }
    });
    const message = Object.assign({}, ...errors)
    res.status(StatusCodes.BAD_REQUEST).json(message)
  }
};
