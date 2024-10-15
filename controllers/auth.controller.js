const tryCatchWrapper = require('../tryCatchWrapper')

exports.register = tryCatchWrapper(async (req, res, next) => {
  res.status(200).json({ message: 'worked' });
});

