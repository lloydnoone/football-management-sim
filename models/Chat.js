const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
  title: { type: String, required: false },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Chat', chatSchema)