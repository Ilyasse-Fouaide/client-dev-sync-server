const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const tryCatchWrapper = require("../tryCatchWrapper");
const User = require("../models/user.model");
const Error = require('../customError');
const { setCookie } = require('../utils');

/**
 * Fetches user profile based on userId.
 * Only the user themselves or an admin can view the profile.
 */
exports.getUser = tryCatchWrapper(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId, { _id: 0, password: 0, role: 0 });

  if (!user) return next(Error.notFound('user not found!'));

  // Authorization: check if the user and admin can access the profile
  const isAdmin = req.user.role === "admin";
  const isOwner = req.user.userId === userId;
  if (!isAdmin && !isOwner) {
    return next(Error.unAuthorized(ReasonPhrases.UNAUTHORIZED));
  }

  res.status(StatusCodes.OK).json(user);
});

exports.updateUser = tryCatchWrapper(async (req, res, next) => {
  const { userId } = req.params;

  // create utils for this
  const isAdmin = req.user.role === "admin";
  const isOwner = req.user.userId === userId;
  if (!isAdmin && !isOwner) {
    return next(Error.unAuthorized(ReasonPhrases.UNAUTHORIZED));
  }

  const user = await User.findByIdAndUpdate(userId, req.body, { new: true });

  if (!user) return next(Error.notFound('user not found!'));

  // generate other token with updated data
  // but when the admin updates other profiles
  // do not generate token
  if (isOwner) {
    setCookie(res, user.genRefreshToken());
  }

  const { password, role, _id, ...others } = user._doc

  res.status(StatusCodes.OK).json(others);
});
