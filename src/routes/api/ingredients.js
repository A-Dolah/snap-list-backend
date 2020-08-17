const express = require('express');
const { check, validationResult } = require('express-validator');
const clarifaiApp = require('../../config/clarifai');
require('dotenv').config();

const router = express.Router();

// @route    POST '/api/ingredients'
// @desc     Make call to Clarifai API
// @access   Public
router.post(
  '/',
  [check('input', 'A url is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const response = await clarifaiApp.models.predict(
        // eslint-disable-next-line
        Clarifai.FOOD_MODEL,
        req.body.input,
      );
      const specificData = response.outputs[0].data.concepts;
      const filteredData = specificData.filter(ingredient => ingredient.value > 0.5);
      const strippedData = filteredData.map(element => element.name);
      res.status(200).json(strippedData);
    } catch (error) {
      res.status(400).json('Failed to work with the Clarifai API');
    }
  },
);

module.exports = router;
