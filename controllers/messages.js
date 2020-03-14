const Chat = require('../models/Chat')
const Message = require('../models/Message')

function createMessage(req, res) {
  req.body.user = req.currentUser
  Chat
    .findById(req.params.id)
    .then(chat => {
      if (!chat) return res.status(404).json({ message: 'chat not Found' })
      Message
        .create(req.body)
        .then(message => {
          chat.messages.push(message)
          chat.save()
          res.status(201).json(chat)
        })
    })
    .catch(err => res.json(err))
}

function deleteMessage(req, res) {
  Chat
    .findById(req.params.id)
    .populate('messages')
    .then(chat => {
      if (!chat) return res.status(404).json({ message: 'chat not Found' })
      //check comment exists
      const message = chat.messages.find(element => element._id.toString() === req.params.messageId)
      if (!message) return res.status(404).json({ message: 'message not found' })
      //check it user is authorized
      if (!message.user._id === req.currentUser._id) return res.status(401).json({ message: 'Unauthorized' })
      //remove comment
      const messages = chat.messages.filter(element => element._id === req.params.messageId)
      chat.messages = messages
      return chat.save()
    })
    .then(chat => res.status(202).json(chat))
    .catch(err => res.json(err))
}

function updateMessage(req, res) {
  Chat
    .findById(req.params.id)
    .populate('messages')
    .then(chat => {
      if (!chat) return res.status(404).json({ message: 'chat not Found' })
      //check comment exists
      const message = chat.messages.find(element => element._id.toString() === req.params.messageId)
      if (!message) return res.status(404).json({ message: 'message not found' })
      //check it user is authorized
      if (!message.user._id === req.currentUser._id) return res.status(401).json({ message: 'Unauthorized. Message not updated. ' })
      //update comment
      chat.messages.forEach((element, i) => {
        if (element._id.toString() === req.params.messageId) chat.messages[i].text = req.body.text
      })
      return chat.save()
    })
    .then(chat => res.status(202).json(chat))
    .catch(err => res.json(err))
}

module.exports = {
  createMessage,
  deleteMessage,
  updateMessage
}