const mongoose = require('mongoose')

const officialSchema = new mongoose.Schema({
  currentClub: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  receivedOffers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Offer' }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Official', officialSchema)