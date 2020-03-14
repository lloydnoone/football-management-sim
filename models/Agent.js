const mongoose = require('mongoose')

const agentSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sentOffers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Offer' }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Agent', agentSchema)