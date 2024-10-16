const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  "APP_NAME": process.env.APP_NAME,
  "APP_ENV": process.env.APP_ENV,
  "APP_URL": process.env.APP_URL,
  "APP_PORT": process.env.APP_PORT,

  "DB_CONNECTION": process.env.DB_CONNECTION,
  "DB_HOST": process.env.DB_HOST,
  "DB_PORT": process.env.DB_PORT,
  "DB_DATABSE": process.env.DB_DATABSE,
  "DB_DATABSE": process.env.DB_DATABSE,

  "JWT_SECRET_KEY": process.env.JWT_SECRET_KEY,
  "JWT_REFRESHTOKEN_LIFETIME": process.env.JWT_REFRESHTOKEN_LIFETIME,
  "JWT_ACCESSTOKEN_LIFETIME": process.env.JWT_ACCESSTOKEN_LIFETIME,
};
