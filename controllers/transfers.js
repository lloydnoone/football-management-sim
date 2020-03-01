const User = require('../models/User')
const Club = require('../models/Club')

function addPlayerTo(req, res) {
  switch (req.params.model) {
    case 'agent':
      User
        .findById(req.params.modelid)
        .then(agent => {
          if (!agent) return res.status(404).json({ message: 'User not found' })
          if (!agent.agentData) return res.status(404).json({ message: 'agentData not found' })
          User
            .findById(req.params.playerid)
            .then(player => {
              if (!player) return res.status(404).json({ message: 'Player not found' })
              agent.agentData.players.push(player)
              res.status(201).json(agent)
              return agent.save()
            })
        })
        .catch(err => res.json(err))
      break

    case 'official':
      User
        .findById(req.params.modelid)
        .then(official => {
          if (!official) return res.status(404).json({ message: 'User not found' })
          if (!official.officialData) return res.status(404).json({ message: 'OfficialData not found' })
          User
            .findById(req.params.playerid)
            .then(player => {
              if (!player) return res.status(404).json({ message: 'Player not found' })
              official.officialData.players.push(player)
              res.status(201).json(official)
              return official.save()
            })
        })
        .catch(err => res.json(err))
      break

    case 'club':
      Club
        .findById(req.params.modelid)
        .then(club => {
          if (!club) return res.status(404).json({ message: 'Club not found' })
          User
            .findById(req.params.playerid)
            .then(player => {
              if (!player) return res.status(404).json({ message: 'Player not found' })
              club.players.push(player)
              res.status(201).json(club)
              return club.save()
            })
        })
        .catch(err => res.json(err))
      break
    default:
      return res.status(404).json({ message: 'model not found' })
  }
  
    
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

module.exports = {
  addPlayerTo,
  removeAgentsPlayer
}