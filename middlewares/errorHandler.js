module.exports = (err, req, res, next) => {
  if (err.status == 404) {
    return res.status(err.status).json({ message: err.message, status: err.status })
  }
}