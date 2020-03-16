const mongoose = require('mongoose')

const officialSchema = new mongoose.Schema({
  currentClub: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', default: null },
  players: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
  receivedOffers: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Offer' }], default: [] },
  wishlist: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] }
}, {
  timestamps: true
})

module.exports = mongoose.model('Official', officialSchema)