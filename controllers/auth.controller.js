const tryCatchWrapper = require('../tryCatchWrapper');
const User = require('../models/user.model');

exports.register = tryCatchWrapper(async (req, res, next) => {
  // unique email in the errorHandler

  const user = new User(req.body);

  await user.save();

  res.status(200).json(req.body);
});

