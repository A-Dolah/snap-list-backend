const mongoose = require('mongoose');

const { Schema } = mongoose;

const ListSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
  },
  name: {
    type: String,
    required: true,
    isUnique: true,
  },
  ingredients: {
    type: [
      {
        ingredient: String,
        done: Boolean,
      },
    ],
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const List = mongoose.model('list', ListSchema);
module.exports = List;
