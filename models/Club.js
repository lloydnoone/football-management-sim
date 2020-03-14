const mongoose = require('mongoose')

const clubSchema = new mongoose.Schema({
  imageUrl: { type: String, required: false },
  name: { type: String, required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  officials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Official' }],
  league: { type: String, required: false },
  transfers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transfer' }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Club', clubSchema)