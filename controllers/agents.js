const User = require('../models/User')

function addPlayerToAgent(req, res, next) {
  User
    .findById(req.params.agentId)
    .then(agent => {
      if (!agent) return res.status(404).json({ message: 'Agent not found' })
      User
        .findById(req.params.playerId)
        .then(player => {
          if (!player) return res.status(404).json({ message: 'Player not found' })
          agent.agentData.players.push(player)
          res.status(201).json(agent)
          return agent.save()
        })
    })
    .catch(next)
}

function removeAgentsPlayer(req, res, next) {
  User
    .findById(req.params.agentId)
    .then(agent => {
      if (!agent) return res.status(404).json({ message: 'Agent not found' })
      agent.agentData.players.filter(element => element._id === req.params.playerId)
      return agent.save()
    })
    .catch(next)
}

function getAgents(req, res, next) {
  User
    .find({})
    .then((users) => {
      const agents = users.filter(user => user.agentData !== null)
      res.status(200).json(agents)
    })
    .catch(next)
}

module.exports = {
  addPlayerToAgent,
  removeAgentsPlayer,
  getAgents
}