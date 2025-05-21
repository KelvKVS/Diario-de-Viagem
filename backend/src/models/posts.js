const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: Date,
  location: String,
  image: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  }
});

module.exports = mongoose.model('posts', postSchema);