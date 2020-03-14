const mongoose = require('mongoose')

const transferSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  official: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  price: { type: Number, required: false }
}, {
  timestamps: true
})

module.exports = mongoose.model('Transfer', transferSchema)