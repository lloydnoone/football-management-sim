const Club = require('../models/Club')
const User = require('../models/User')

function createClub(req, res) {
  Club
    .create(req.body)
    .then(club => res.status(200).json(club))
    .catch(err => res.json(err))
}

function getClubs(req, res) {
  Club
    .find({})
    .then(clubs => {
      if (!clubs) return res.status(404).json({ message: 'clubs not found' })
      return res.status(200).json(clubs)
    })
    .catch(err => res.json(err))
}

function getClub(req, res) {
  Club
    .findById(req.params.id)
    .then(club => {
      if (!club) return res.status(404).json({ message: 'club not found' })
      return res.status(200).json(club)
    })
    .catch(err => res.json(err))
}

function deleteClub(req, res) {
  Club
    .findByIdAndRemove(req.params.id, () => res.sendStatus(204)) 
    .catch(err => res.status(400).json(err)) 
}

function updateClub(req, res) {
  Club
    .findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }) // set this to get the updated copy instead of the old one.
    .then(user => res.status(202).json(user))
    .catch(err => res.json(err))
}

function addPlayerToClub(req, res) {
  Club
    .findById(req.params.clubId)
    .then(club => {
      if (!club) return res.status(404).json({ message: 'club not found' })
      User
        .findById(req.params.playerId)
        .then(player => {
          if (!player) return res.status(404).json({ message: 'player not found' })
          if (!player.playerData) return res.status(404).json({ message: 'playerData not found' })
          club.players.push(player)
          res.status(201).json(club)
          return club.save()
        })
    })
    .catch(err => res.json(err))
}

module.exports = {
  createClub,
  addPlayerToClub,
  getClubs,
  getClub,
  deleteClub,
  updateClub
}