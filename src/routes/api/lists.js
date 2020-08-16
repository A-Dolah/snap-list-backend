const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');
require('dotenv').config();

const router = express.Router();

const List = require('../../models/List');

// @route    POST '/api/lists'
// @desc     Create a lists
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('list', 'A list is required').not().isEmpty(),
      check('name', 'A list name is required').not().isEmpty(),
      check('image_url', 'The list does not have a url to an image')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // eslint-disable-next-line
    const { name, image_url } = req.body;
    const user = req.user.id;
    try {
      let newList = await List.findOne({ name, user });
      if (newList) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'List already exists' }] });
      }
      newList = new List({
        user,
        name,
        ingredients: req.body.list,
        image_url,
      });
      const list = await newList.save();
      res.json(list);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  },
);

// @route    GET '/api/lists'
// @desc     Get a users all lists
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const lists = await List.find({ user: req.user.id }).sort({ date: -1 });
    res.json(lists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET '/api/lists/:id
// @desc     Get list by ID
// @access   Private
router.get('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE '/api/lists/:id'
// @desc     Delete a list
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    // Check user
    if (list.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: 'User not authorized to delete this list' });
    }
    await list.remove();
    res.json({ msg: 'List removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT '/api/lists/:id
// @desc     Update a list
// @access   Private
router.put('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    // Check user
    if (list.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: 'User not authorized to change this list' });
    }
    const updatedList = await List.findOneAndUpdate(
      { _id: req.params.id },
      { ingredients: req.body.ingredients },
    );
    return res.json(updatedList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
