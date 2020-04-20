const User = require('../models/User')

function getUsers(req, res) {
  User
    .find({})
    .then(users => res.status(200).json(users))
    .catch(err => res.json(err))
}

function getUser(req, res) {
  User
    .findById(req.params.id)
    .populate([{
      path: 'agentData.players',
      model: 'User',
      populate: {
        path: 'playerData.currentClub',
        model: 'Club'
      }
    }])
    .populate([{
      path: 'transfers',
      model: 'Transfer',
      populate: [{
        path: 'player',
        model: 'User'
      },
      {
        path: 'from',
        model: 'Club'
      },
      {
        path: 'to',
        model: 'Club'
      }]
    }])
    .populate([{
      path: 'playerData.currentClub',
      model: 'Club'
    }])
    .populate([{
      path: 'officialData.currentClub',
      model: 'Club'
    }])
    .then(user => res.status(200).json(user))
    .catch(err => res.json(err))
}

function deleteUser(req, res) {
  User
    .findByIdAndRemove(req.params.id, () => res.sendStatus(204)) 
    .catch(err => res.status(400).json(err)) 
}

function updateUser(req, res) {
  User
    .findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }) // set this to get the updated copy instead of the old one.
    .then(user => res.status(202).json(user))
    .catch(err => res.json(err))
}

function sendRequest(req, res) {
  User.
    findById(req.params.fromUser)
    .then(fromUser => {
      if (!fromUser) return res.status(404).json({ message: 'fromUser not found' })
      User.
        findById(req.params.toUser)
        .then(toUser => {
          if (!toUser) return res.status(404).json({ message: 'toUser not found' })
          toUser.connectionRequests.push(fromUser)
          fromUser.sentRequests.push(toUser)
          toUser.save()
          fromUser.save()
          res.status(201).json({ message: 'friend request sent' })
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
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  sendRequest,
  deleteRequest,
  acceptRequest,
  deleteConnection
}