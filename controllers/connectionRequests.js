const User = require('../models/User')
const ConnectionRequest = require('../models/ConnectionRequest')

function sendRequest(req, res) {
  User.
    findById(req.params.fromUser)
    .then(fromUser => {
      if (!fromUser) return res.status(404).json({ message: 'fromUser not found' })
      User.
        findById(req.params.toUser)
        .then(toUser => {
          if (!toUser) return res.status(404).json({ message: 'toUser not found' })
          //create connection request
          const requestData = {
            dateSent: new Date(),
            fromUser: fromUser,
            toUser: toUser
          }
          ConnectionRequest
            .create(requestData)
            .then(createdReq => {
              console.log('createdReq: ', createdReq)
              toUser.connectionRequests.push(createdReq)
              fromUser.sentRequests.push(createdReq)
              toUser.save()
              fromUser.save()
            })
            .then(() => res.status(201).json({ message: 'friend request sent' }))
        })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
}

function deleteRequest(req, res) {
  User.
    findById(req.params.fromUser)
    .then(fromUser => {
      if (!fromUser) return res.status(404).json({ message: 'fromUser not found' })
      User.
        findById(req.params.toUser)
        .then(toUser => {
          if (!toUser) return res.status(404).json({ message: 'toUser not found' })
          toUser.connectionRequests = toUser.connectionRequests.filter(element => element._id === req.params.fromUser)
          fromUser.sentRequests = fromUser.sentRequests.filter(element => element._id === req.params.toUser)
          toUser.save()
          fromUser.save()
          res.status(201).json({ message: 'friend request deleted' })
        })
    })
    .catch(err => res.json(err))
}

function acceptRequest(req, res) {
  //add to both users connections
  User.
    findById(req.params.fromUser)
    .then(fromUser => {
      if (!fromUser) return res.status(404).json({ message: 'fromUser not found' })
      User.
        findById(req.params.toUser)
        .then(toUser => {
          if (!toUser) return res.status(404).json({ message: 'toUser not found' })
          toUser.connections.push(fromUser)
          fromUser.connections.push(toUser)
          // cleanup requests
          toUser.connectionRequests = toUser.connectionRequests.filter(element => element._id === req.params.fromUser)
          fromUser.sentRequests = fromUser.sentRequests.filter(element => element._id === req.params.toUser)
          toUser.save()
          fromUser.save()
          res.status(201).json({ message: 'friend request accepted' })
        })
    })
    .catch(err => res.json(err))
}

function deleteConnection(req, res) {
  User.
    findById(req.params.fromUser)
    .then(fromUser => {
      if (!fromUser) return res.status(404).json({ message: 'fromUser not found' })
      User.
        findById(req.params.toUser)
        .then(toUser => {
          if (!toUser) return res.status(404).json({ message: 'toUser not found' })
          toUser.connections = toUser.connections.filter(element => element._id === req.params.fromUser)
          fromUser.connections = fromUser.connections.filter(element => element._id === req.params.toUser)
          toUser.save()
          fromUser.save()
          res.status(201).json({ message: 'connection deleted' })
        })
    })
    .catch(err => res.json(err))
}

module.exports = {
  sendRequest,
  deleteRequest,
  acceptRequest,
  deleteConnection
}