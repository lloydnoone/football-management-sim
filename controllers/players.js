const User = require('../models/User')

function getPlayers(req, res, next) {
  User
    .find({})
    .then((users) => {
      const players = users.filter(user => user.playerData !== null)
      res.status(200).json(players)
    })
    .catch(next)
}

module.exports = {
  getPlayers
}