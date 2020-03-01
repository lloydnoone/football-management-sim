const User = require('../models/User')

function getPlayers(req, res) {
  User
    .find({})
    .then((users) => {
      const players = users.filter(user => user.playerData !== null)
      res.status(200).json(players)
    })
    .catch(err => res.json(err))
}

function updatePlayerData(req, res) {
  User
    .findById(req.params.id)
    .then(user => {
      if (!user) return res.status(404).json({ message: 'Player not found' })
      if (!user.playerData) return res.status(404).json({ message: 'playerData property is null' })
      user.playerData = Object.assign(user.playerData, req.body)
      user.save(err => {
        if (err) res.status(500).json({ message: 'could not save: ', err: err })
      })
      
      res.status(202).json(user)
    })
    .catch(err => res.json(err))
}

module.exports = {
  getPlayers,
  updatePlayerData
}