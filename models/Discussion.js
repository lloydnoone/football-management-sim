const mongoose = require('mongoose')

const discussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Discussion', discussionSchema)