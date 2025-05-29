const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isPublic: { type: Boolean, default: true },
  startDate: Date,
  endDate: Date,
  coverImage: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true, collection: 'trips' });

module.exports = mongoose.model('Trip', tripSchema);
