const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isPublic: { type: Boolean, default: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true,
  collection: 'trip' 
});

module.exports = mongoose.model('Trip', tripSchema);
