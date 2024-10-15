const express = require('express');
const config = require('./config');
const notFound = require('./middlewares/notFound');
const erroHander = require('./middlewares/errorHandler');
const connect = require('./db/connect');

const app = express();

app.use('/', require('./routes/auth.routes'));
app.use(notFound);
app.use(erroHander);

const start = async () => {
  try {
    const URI = `${config.DB_CONNECTION}://${config.DB_HOST}:${config.DB_PORT}/${config.DB_DATABSE}`;
    await connect(URI);
    app.listen(config.APP_PORT, () => console.log(`APP RUNNIGN AT PORT ${config.APP_PORT}`));
  } catch (error) {

  }
}

start();