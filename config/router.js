const router = require('express').Router()
const jobs = require('../controllers/jobs')
const users = require('../controllers/auth')
const agents = require('../controllers/agents')
const players = require('../controllers/players')
const secureRoute = require('../lib/secureRoute')

router.route('/jobs/:title/:location')
  .get(jobs.index)

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

router.route('/users/jobs')
  .post(secureRoute, jobs.jobCreate)

//AGENT ROUTES

router.route('/agents')
  .get(agents.getAgents)

//ADD/REMOVE AGENTS PLAYERS
router.route('/agents/:agentId/agentsplayers/:playerId')
  .post(secureRoute, agents.addPlayerToAgent)
  .delete(secureRoute, agents.removeAgentsPlayer)

//PLAYER ROUTES

router.route('/players')
  .get(players.getPlayers)

module.exports = router
