const tryCatchWrapper = require('../tryCatchWrapper');
const User = require('../models/user.model');
const Error = require('../customError');
const { StatusCodes } = require('http-status-codes');
const { setCookie } = require('../utils');

exports.register = tryCatchWrapper(async (req, res, next) => {
  const user = new User(req.body);

  await user.save();

  res.status(StatusCodes.CREATED).json(req.body);
});

exports.login = tryCatchWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(Error.badRequest(`email or password required`));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(Error.notFound('Invalid Credentials'));
  }

  const validPassword = await user.comparePassword(password, user.password);

  if (!validPassword) {
    return next(Error.badRequest('Invalid Credentials'));
  }

  setCookie(res, user.genRefreshToken());

  res.status(StatusCodes.OK).json({ body: req.body, token: user.genRefreshToken() });
});

module.exports.logout = (req, res) => {
  //clear cookie
  res
    .status(StatusCodes.OK)
    .cookie('refresh_token', '', {
      httpOnly: true,
      expires: new Date(Date.now())  // expires now
    })
    .json({ message: "Logged out!." });
}

exports.profile = tryCatchWrapper(async (req, res, next) => {
  res.status(StatusCodes.OK).json(req.user);
});
