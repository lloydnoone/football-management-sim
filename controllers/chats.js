const Chat = require('../models/Chat')
const User = require('../models/User')

function createChat(req, res) {
  Chat
    .create(req.body)
    .then(chat => {
      chat.users.push(req.currentUser)
      return chat.save()
    })
    .then(chat => res.status(201).json(chat))
    .catch(err => res.json(err))
}

function getChats(req, res) {
  Chat
    .find({})
    .then(chats => res.status(200).json(chats))
    .catch(err => res.json(err))
}

function getChat(req, res) {
  Chat
    .find({ _id: req.params.id })
    .populate([{
      path: 'comments',
      model: 'Comment'
    },
    {
      path: 'Users',
      model: 'User'
    }])
    .then(chat => res.status(200).json(chat))
    .catch(err => res.json(err))
}

function deleteChat(req, res) {
  Chat
    .findByIdAndRemove(req.params.id, () => res.sendStatus(204))
    .catch(err => res.json(err))
}

function updateChat(req, res) {
  Chat
    .findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }) // set this to get the updated copy instead of the old one.
    .then(user => res.status(202).json(user))
    .catch(err => res.json(err))
}

function getUsersChats(req, res) {
  Chat
    .find({ users: req.params.id })
    .then(chats => res.status(200).json(chats))
    .catch(err => res.json(err))
}

function addUserToChat(req, res) {
  Chat
    .findById(req.params.id)
    .then(chat => {
      User
        .findById(req.params.userId)
        .then(user => {
          if (!chat.users.includes(req.params.userId)) chat.users.push(user)
          res.status(201).json(chat)
          chat.save()
        })
    })
}

module.exports = {
  createChat,
  getChats,
  deleteChat,
  updateChat,
  getChat,
  getUsersChats,
  addUserToChat
}