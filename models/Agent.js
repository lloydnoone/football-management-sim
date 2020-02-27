const mongoose = require('mongoose')

const agentSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  transfers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transfer' }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Agent', agentSchema)