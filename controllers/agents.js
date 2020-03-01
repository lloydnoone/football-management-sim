const User = require('../models/User')

function addPlayerToAgent(req, res) {
  User
    .findById(req.params.agentId)
    .then(agent => {
      if (!agent) return res.status(404).json({ message: 'Agent not found' })
      if (!agent.agentData) return res.status(404).json({ message: 'agentData not found' })
      User
        .findById(req.params.playerId)
        .then(player => {
          if (!player) return res.status(404).json({ message: 'Player not found' })
          agent.agentData.players.push(player)
          res.status(201).json(agent)
          return agent.save()
        })
    })
    .catch(err => res.json(err))
}

function removeAgentsPlayer(req, res) {
  User
    .findById(req.params.agentId)
    .then(agent => {
      if (!agent) return res.status(404).json({ message: 'Agent not found' })
      if (!agent.agentData) return res.status(404).json({ message: 'agentData not found' })
      agent.agentData.players.filter(element => element._id === req.params.playerId)
      return agent.save()
    })
    .catch(err => res.json(err))
}

function getAgents(req, res) {
  User
    .find({})
    .then((users) => {
      const agents = users.filter(user => user.agentData !== null)
      res.status(200).json(agents)
    })
    .catch(err => res.json(err))
}

function updateAgentData(req, res) {
  User
    .findById(req.params.id)
    .then(user => {
      if (!user) return res.status(404).json({ message: 'Agent not found' })
      if (!user.agentData) return res.status(404).json({ message: 'agentData property is null' })
      user.agentData = Object.assign(user.agentData, req.body)
      user.save(err => {
        if (err) res.status(500).json({ message: 'could not save: ', err: err })
      })
      res.status(202).json(user)
    })
    .catch(err => res.json(err))
}

module.exports = {
  addPlayerToAgent,
  removeAgentsPlayer,
  getAgents,
  updateAgentData
}