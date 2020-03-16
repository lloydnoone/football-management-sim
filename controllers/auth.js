const User = require('../models/User') // the user model to get find and create
const jwt = require('jsonwebtoken')
const { secret } = require('../config/environment') //a plain string to encode our tokens, we shouldnt expose this publically

function register(req, res) {
  User
    .create(req.body)// same as other creates but runs our extra pre save and validate methods. See model/user for these
    .then(user => {
      const token = jwt.sign( { sub: user._id }, secret, { expiresIn: '6h' } )
      res.status(201).json({ message: `Thanks for registering ${user.username}`, token })
    })
    .catch(err => res.status(403).json(err))
}

//user supplies body of request - email and password
function login(req, res) {
  User
    .findOne({ email: req.body.email }) // fond the user by that email
    .then(user => { // check to see if we find record and the password mathes the pass in the database
      if (!user || !user.validatePassword(req.body.password)) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
      // if its ok create a token baking in user id, secret to encode and expiry time
      const token = jwt.sign( { sub: user._id }, secret, { expiresIn: '6h' } )
      res.status(202).json({ userId: user._id, message: `Welcome Back ${user.username}`, token })
    })
    .catch(() => res.status(401).json( { message: 'Unauthorized' } ))
}

function profile(req, res) {
  User
    .findById(req.currentUser._id)
    .populate('connections')
    .populate('agentData.players')
    .populate('officialData.players')
    .populate('officialData.currentClub')
    .populate('playerData.currentClub')
    .then(user => {
      console.log(user)
      res.status(200).json(user)
    })
    .catch(err => res.json(err))
}

module.exports = {
  register,
  login,
  profile
}