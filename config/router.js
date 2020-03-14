const router = require('express').Router()
const auth = require('../controllers/auth')
const users = require('../controllers/users')
const agents = require('../controllers/agents')
const players = require('../controllers/players')
const clubs = require('../controllers/clubs')
const officials = require('../controllers/officials')
const transfers = require('../controllers/transfers')
const discussions = require('../controllers/discussions')
const comments = require('../controllers/comments')
const chats = require('../controllers/chats')
const messages = require('../controllers/messages')
const offers = require('../controllers/offers')
const secureRoute = require('../lib/secureRoute')

// BASIC AUTH

router.route('/register')
  .post(auth.register)

router.route('/login')
  .post(auth.login)

router.route('/profile')
  .get(secureRoute, auth.profile)

router.route('/users')
  .get(users.getUsers)

router.route('/users/:id')
  .get(users.getUser)
  .delete(secureRoute, users.deleteUser)
  .put(secureRoute, users.updateUser)

//CONNECTIONS ROUTES

router.route('/connection-request/from/:fromUser/to/:toUser')
  .put(users.acceptRequest)
  .post(users.sendRequest)
  .delete(users.deleteRequest)

router.route('/connection/from/:fromUser/to/:toUser')
  .delete(users.deleteConnection)



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

//OFFICIAL ROUTES

router.route('/officials')
  .get(officials.getOfficials)

router.route('/officials/:id')
  .put(officials.updateOfficialData)

//TRANSFER ROUTES

//ADD/REMOVE PLAYER ROUTES
router.route('/player/:playerid/in/:model/:modelid')
  .post(transfers.addPlayerTo)
  .delete(transfers.removePlayerFrom)

router.route('transfer/player/:playerid/from/:currentclub/to/:nextclub')
  .post(transfers.transfer)

//FORUM ROUTES

//DISCUSSION ROUTES
router.route('/discussions')
  .post(secureRoute, discussions.createDiscussion)
  .get(discussions.getDiscussions)

router.route('/discussions/:id')
  .delete(discussions.deleteDiscussion)
  .put(discussions.updateDiscussion)
  .get(discussions.getDiscussion)

router.route('/discussions/:id/comments')
  .post(secureRoute, comments.createComment)

router.route('/discussions/:id/comments/:commentId')
  .delete(secureRoute, comments.deleteComment)
  .put(secureRoute, comments.updateComment)

//CHAT ROUTES
router.route('/chats')
  .post(secureRoute, chats.createChat)
  .get(chats.getChats)

router.route('/chats/:id')
  .get(chats.getChat)
  .delete(chats.deleteChat)
  .put(chats.updateChat)

//MESSAGE ROUTES
router.route('/chats/:id/messages')
  .post(secureRoute, messages.createMessage)

router.route('/chats/:id/messages/:messageId')
  .delete(secureRoute, messages.deleteMessage)
  .put(secureRoute, messages.updateMessage)

router.route('/chats/:id/users/:userId')
  .post(chats.addUserToChat)

router.route('/users/:id/chats')
  .get(chats.getUsersChats)

router.route('/users/:id/discussions')
  .get(discussions.getUsersDiscussions)

//OFFER ROUTES
router.route('/offer/player/:playerid/from/:currentclub/to/:nextclub')
  .post(offers.sendOffer)

router.route('/offers/:id')
  .get(offers.getOffer)
  .put(offers.updateOffer)
  .delete(offers.deleteOffer)

router.route('/offers')
  .get(offers.getOffers)

//WISHLIST ROUTES
router.route('/wishlist/player/:playerid/in/:model/:modelid')
  .post(transfers.addToWishlist)
  .delete(transfers.removeFromWishlist)

module.exports = router
