const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
  position: { type: String, required: false, default: 'not specified' },
  height: { type: Number, required: false, default: null },
  weight: { type: Number, required: false, default: null },
  age: { type: Number, required: false, default: null },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  official: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  currentClub: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  league: { type: String, required: false, default: 'not specified' },
  contractEnd: { type: Date, required: false, default: null },
  type: { type: String, required: false, default: 'not specified' },
  price: { type: Number, required: false, default: null },
  matchBonus: { type: Number, required: false, default: null },
  goalBonus: { type: Number, required: false, default: null }
}, {
  timestamps: true
})

module.exports = mongoose.model('Player', playerSchema)