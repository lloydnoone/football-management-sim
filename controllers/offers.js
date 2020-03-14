const User = require('../models/User')
const Club = require('../models/Club')
const Offer = require('../models/Offer')

function sendOffer(req, res) {
  User
    .findById(req.params.playerid)
    .then(player => {
      if (!player) return res.status(404).json({ message: 'Player not found' })
      if (!player.playerData.official) return res.status(404).json({ message: 'Player must associate with official before offer' })
      if (req.params.currentclub === 'none') {
        Club
          .findById(req.params.nextclub)
          .then(nextclub => {
            if (!nextclub) return res.status(404).json({ message: 'Next club not found' })
            // record offer data
            const offerData = {
              player: player,
              agent: player.playerData.agent,
              official: player.playerData.official,
              from: null,
              to: nextclub,
              price: player.playerData.price,
              matchBonus: player.playerData.matchBonus,
              goalBonus: player.playerData.goalBonus
            }
            Offer
              .create(offerData)
              .then(newOffer => {
                // add to agents sent offers
                User
                  .findById(player.playerData.agent._id)
                  .then(agent => {
                    if (!agent) return res.status(404).json({ message: 'Agent not found' })
                    agent.agentData.sentOffers.push(newOffer)
                    agent.save()
                  })
                // add to officials received offers
                User
                  .findById(player.playerData.official._id)
                  .then(official => {
                    if (!official) return res.status(404).json({ message: 'Official not found' })
                    official.officialData.receivedOffers.push(newOffer)
                    official.save()
                  })
                res.status(201).json(newOffer)
              })
            return
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
                // record offer data
                const offerData = {
                  player: player,
                  agent: player.playerData.agent,
                  official: player.playerData.official,
                  from: currentclub,
                  to: nextclub,
                  price: player.playerData.price,
                  matchBonus: player.playerData.matchBonus,
                  goalBonus: player.playerData.goalBonus
                }
                Offer
                  .create(offerData)
                  .then(newOffer => {
                    // add to agents sent offers
                    User
                      .findById(player.playerData.agent._id)
                      .then(agent => {
                        if (!agent) return res.status(404).json({ message: 'Agent not found' })
                        agent.agentData.sentOffers.push(newOffer)
                        agent.save()
                      })
                    // add to officials received offers
                    User
                      .findById(player.playerData.official._id)
                      .then(official => {
                        if (!official) return res.status(404).json({ message: 'Official not found' })
                        official.officialData.receivedOffers.push(newOffer)
                        official.save()
                      })
                    res.status(201).json(newOffer)
                  })
                return
              })
          })
      }
    })
    .catch(err => res.json(err))
}

function getOffer(req, res) {
  Offer
    .findById(req.params.id)
    .then(offer => res.status(200).json(offer))
    .catch(err => res.json(err))
}

function updateOffer(req, res) {
  Offer
    .findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }) // set this to get the updated copy instead of the old one.
    .then(user => res.status(202).json(user))
    .catch(err => res.json(err))
}

function deleteOffer(req, res) {
  Offer
    .findByIdAndRemove(req.params.id, () => res.sendStatus(204)) 
    .catch(err => res.status(400).json(err)) 
}

function getOffers(req, res) {
  Offer
    .find({})
    .then(offers => res.status(200).json(offers))
    .catch(err => res.json(err))
}

module.exports = {
  sendOffer,
  getOffer,
  updateOffer,
  deleteOffer,
  getOffers
}