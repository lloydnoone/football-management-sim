const mongoose = require('mongoose')

const agentSchema = new mongoose.Schema({
  players: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
  sentOffers: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Offer' }], default: [] },
  wishlist: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] }
}, {
  timestamps: true
})

module.exports = mongoose.model('Agent', agentSchema)