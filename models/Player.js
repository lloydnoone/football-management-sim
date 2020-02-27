const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
  position: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  age: { type: Number, required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  currentClub: { type: String, required: false },
  league: { type: String, required: false },
  contractEnd: { type: Date, required: false }
}, {
  timestamps: true
})

module.exports = mongoose.model('Player', playerSchema)