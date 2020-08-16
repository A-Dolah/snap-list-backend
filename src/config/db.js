const mongoose = require('mongoose');
require('dotenv').config();

const uri = `mongodb+srv://Adam:${process.env.DB_PASS}@${process.env.DB_CLUSTER}`;

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log('Connected correctly to server...');
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports = connectDB;
