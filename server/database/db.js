const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const mongoDB = "mongodb://127.0.0.1:27017/RaagaDataBase";
const options = {
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(mongoDB, options)
  .then(() => {
    console.log('Connected successfully to MongoDB server');
    const db = mongoose.connection.db;
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

module.exports = mongoose.connection