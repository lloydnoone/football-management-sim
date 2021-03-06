const User = require('../models/User')
const Club = require('../models/Club')
const Transfer = require('../models/Transfer')

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
              player.playerData.agent = agent
              player.save()
              agent.agentData.players.push(player)
              res.status(201).json(agent)
              return agent.save()
            })
            .catch(err => {
              console.log(err)
              res.json(err)
            })
        })
        .catch(err => {
          console.log(err)
          res.json(err)
        })
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
              player.playerData.official = official
              player.save()
              official.officialData.players.push(player)
              res.status(201).json(official)
              return official.save()
            })
            .catch(err => {
              console.log(err)
              res.json(err)
            })
        })
        .catch(err => {
          console.log(err)
          res.json(err)
        })
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
              player.playerData.currentClub = club
              player.save()
              club.players.push(player)
              res.status(201).json(club)
              return club.save()
            })
        })
        .catch(err => {
          console.log(err)
          res.json(err)
        })
      break
    default:
      return res.status(404).json({ message: 'model not found' })
  }
}

function removePlayerFrom(req, res) {
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
              player.playerData.agent = null
              player.save()
              agent.agentData.players = agent.agentData.players.filter(element => element._id === req.params.playerid)
              res.status(201).json(agent)
              return agent.save()
            })
            .catch(err => {
              console.log(err)
              res.json(err)
            })
        })
        .catch(err => {
          console.log(err)
          res.json(err)
        })
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
              player.playerData.official = null
              player.save()
              official.officialData.players = official.officialData.players.filter(element => element._id === req.params.playerid)
              res.status(201).json(official)
              return official.save()
            })
            .catch(err => {
              console.log(err)
              res.json(err)
            })
        })
        .catch(err => {
          console.log(err)
          res.json(err)
        })
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
              player.playerData.currentClub = null
              player.save()
              club.players = club.players.filter(element => element._id === req.params.playerid)
              res.status(201).json(club)
              return club.save()
            })
            .catch(err => {
              console.log(err)
              res.json(err)
            })
        })
        .catch(err => {
          console.log(err)
          res.json(err)
        })
      break
    default:
      return res.status(404).json({ message: 'model not found' })
  }
}

function transfer(req, res) {
  User
    .findById(req.params.playerid)
    .then(player => {
      if (!player) return res.status(404).json({ message: 'Player not found' })
      if (!player.playerData.official) return res.status(404).json({ message: 'Player must associate with official before transfer' })
      if (req.params.currentclub === 'none') {
        Club
          .findById(req.params.nextclub)
          .then(nextclub => {
            if (!nextclub) return res.status(404).json({ message: 'Next club not found' })
            //add to next club
            nextclub.players.push(player)
            // update player
            player.playerData.currentClub = nextclub
            //player.save() cant save more than once so wait until the end of transfer
            // record transfer data
            const transferData = {
              player: player,
              agent: player.playerData.agent,
              official: player.playerData.official,
              from: null,
              to: nextclub,
              price: player.playerData.price,
              matchBonus: player.playerData.matchBonus,
              goalBonus: player.playerData.goalBonus,
              type: req.body.type,
              fee: req.body.fee
            }
            Transfer
              .create(transferData)
              .then(newTransfer => {
                // add record of transfer to each party
                // add to the agent
                User
                  .findById(player.playerData.agent._id)
                  .then(agent => {
                    if (!agent) return res.status(404).json({ message: 'Agent not found' })
                    agent.transfers.push(newTransfer)
                    agent.save()
                  })
                  .catch(err => {
                    console.log(err)
                    res.json(err)
                  })
                // add record of tansfer to official
                User
                  .findById(player.playerData.official._id)
                  .then(official => {
                    if (!official) return res.status(404).json({ message: 'Official not found' })
                    official.transfers.push(newTransfer)
                    official.save()
                  })
                  .catch(err => {
                    console.log(err)
                    res.json(err)
                  })
                //add record of transfer to player
                player.transfers.push(newTransfer)
                player.save()
                // add to the next club
                nextclub.transfers.push(newTransfer)
                player.save()
                res.status(201).json(newTransfer)
              })
              .catch(err => {
                console.log(err)
                res.json(err)
              })
            return
          })
          .catch(err => {
            console.log(err)
            res.json(err)
          })
      } else {
        Club
          .findById(req.params.currentclub)
          .then(currentclub => {
            if (!currentclub) return res.status(404).json({ message: 'Current club not found' })
            Club
              .findById(req.params.nextclub)
              .then(nextclub => {
                if (!nextclub) return res.status(404).json({ message: 'Next club not found' })
                //remove from current club
                currentclub.players = currentclub.players.filter(element => element._id === req.params.playerid)
                //add to next club
                nextclub.players.push(player)
                // update player
                player.playerData.currentClub = nextclub
                //player.save() should only save once so wait until end of transfer
                // record transfer data
                const transferData = {
                  player: player,
                  agent: player.playerData.agent,
                  official: player.playerData.official,
                  from: currentclub,
                  to: nextclub,
                  price: player.playerData.price,
                  matchBonus: player.playerData.matchBonus,
                  goalBonus: player.playerData.goalBonus,
                  type: req.body.type,
                  fee: req.body.fee
                }
                Transfer
                  .create(transferData)
                  .then(newTransfer => {
                    // add record of transfer to each party
                    // add to the agent
                    User
                      .findById(player.playerData.agent._id)
                      .then(agent => {
                        if (!agent) return res.status(404).json({ message: 'Agent not found' })
                        agent.transfers.push(newTransfer)
                        agent.save()
                      })
                    // add record of tansfer to official
                    User
                      .findById(player.playerData.official._id)
                      .then(official => {
                        if (!official) return res.status(404).json({ message: 'Official not found' })
                        official.transfers.push(newTransfer)
                        official.save()
                      })
                    //add record of transfer to player
                    player.transfers.push(newTransfer)
                    player.save()
                    // add to the clubs
                    currentclub.transfers.push(newTransfer)
                    currentclub.save()
                    nextclub.transfers.push(newTransfer)
                    nextclub.save()
                    res.status(201).json(newTransfer)
                  })
                return
              })
          })
      }
    })
    .catch(err => res.json(err))
}

function addToWishlist(req, res) {
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
              agent.agentData.wishlist.push(player)
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
              official.officialData.wishlist.push(player)
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
              club.wishlist.push(player)
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

function removeFromWishlist(req, res) {
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
              agent.agentData.wishlist = agent.agentData.wishlist.filter(element => element._id === req.params.playerid)
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
              official.officialData.wishlist = official.officialData.wishlist.filter(element => element._id === req.params.playerid)
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
              club.wishlist = club.wishlist.filter(element => element._id === req.params.playerid)
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

module.exports = {
  addPlayerTo,
  removePlayerFrom,
  transfer,
  addToWishlist,
  removeFromWishlist
}