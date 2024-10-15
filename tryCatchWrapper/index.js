const tryCatchWrapper = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      console.log(error)
      next(error);
    }
  }
}

module.exports = tryCatchWrapper
