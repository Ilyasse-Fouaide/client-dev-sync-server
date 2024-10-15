const mongoose = require('mongoose');

const connect = async (URI) => {
  await mongoose.connect(URI);
  console.log(`APP CONNECTED WITH DB > ${URI}`)
};

module.exports = connect;
