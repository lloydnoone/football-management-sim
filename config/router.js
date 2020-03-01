const router = require('express').Router()
const users = require('../controllers/auth')
const agents = require('../controllers/agents')
const players = require('../controllers/players')
const clubs = require('../controllers/clubs')
const officials = require('../controllers/officials')
const transfers = require('../controllers/transfers')
const secureRoute = require('../lib/secureRoute')

// BASIC AUTH

router.route('/register')
  .post(users.register)

router.route('/register')
  .post(users.register)

router.route('/login')
  .post(users.login)

router.route('/profile')
  .get(secureRoute, users.profile)

router.route('/users')
  .get(users.getUsers)

router.route('/users/:id')
  .get(users.getUser)
  .delete(secureRoute, users.deleteUser)
  .put(secureRoute, users.updateUser)

//AGENT ROUTES

router.route('/agents')
  .get(agents.getAgents)

router.route('/agents/:id')
  .put(secureRoute, agents.updateAgentData)

//ADD/REMOVE AGENTS PLAYERS
router.route('/agents/:agentId/agentsplayers/:playerId')
  .post(secureRoute, agents.addPlayerToAgent)
  .delete(secureRoute, agents.removeAgentsPlayer)

//PLAYER ROUTES

router.route('/players')
  .get(players.getPlayers)

router.route('/players/:id')
  .put(secureRoute, players.updatePlayerData)

//CLUB ROUTES

router.route('/clubs')
  .post(clubs.createClub)
  .get(clubs.getClubs)

router.route('/clubs/:id')
  .get(clubs.getClub)
  .put(clubs.updateClub)
  .delete(clubs.deleteClub)

//router.route('/addplayertoclub/club/:clubId/player/:playerId')
//.post(clubs.addPlayerToClub)

//OFFICIAL ROUTES

router.route('/officials')
  .get(officials.getOfficials)

router.route('/officials/:id')
  .put(officials.updateOfficialData)

//TRANSFER ROUTES

// router.route('/transfer/player/:playerId/agent/:agentId/from/:clubId/to/:clubId')
//   .post(transfers.transferFromAgentToClub)

router.route('/addplayer/:playerid/to/:model/:modelid')
  .post(transfers.addPlayerTo)

module.exports = router
