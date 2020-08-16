const Clarifai = require('clarifai');
require('dotenv').config();

const clarifaiApp = new Clarifai.App({
  apiKey: process.env.CLARIFAI_KEY,
});

module.exports = clarifaiApp;
