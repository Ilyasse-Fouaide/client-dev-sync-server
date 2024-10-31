const express = require('express');
const config = require('./config');
const notFound = require('./middlewares/notFound');
const erroHander = require('./middlewares/errorHandler');
const connect = require('./db/connect');
const cookieParser = require('cookie-parser');
const cors = require('cors')

const app = express();

app.use(cors({
  origin: config.CLIENT_URL,
  // origin: 'http://127.0.0.1:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/user-projects/', require('./routes/userProjectsRole.routes'));
app.use('/api/v1/projects', require('./routes/project.routes'));
app.use('/api/v1/admin', require('./routes/admin.routes'));
app.use('/api/v1/users', require('./routes/user.routes'));
app.use('/api/v1', require('./routes/auth.routes'));
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