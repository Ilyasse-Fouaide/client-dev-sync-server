const jwt = require('jsonwebtoken');
const Error = require('../customError');
const config = require('../config');

const authorized = (req, res, next) => {
  const { refresh_token } = req.cookies;

  if (!refresh_token) {
    return next(Error.unAuthorized());
  }

  jwt.verify(refresh_token, config.JWT_SECRET_KEY, (err, decoded) => {
    if (err) return next(Error.unAuthorized());

    const user = {
      userId: decoded.userId,
      full_name: decoded.full_name,
      image: decoded.image,
      email: decoded.email,
      role: decoded.role,
    }

    req.user = user;
    next();
  });
}

module.exports = authorized;
