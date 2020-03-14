const User = require('../models/User')
const { secret } = require('../config/environment')
const jwt = require('jsonwebtoken')

function secureRoute(req, res, next) {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Secure route, no token.' })
  }

  const token = req.headers.authorization.replace('Bearer ', '')

  jwt.verify(token, secret, (err, payload) => {
    if (err) return res.status(401).json({ message: 'Secure route. Unverifyed' })

    User
      .findById(payload.sub)
      .then(user => {
        if (!user) return res.status(401).json({ message: 'Secure route. User not found' })
        req.currentUser = user //attaches user with needed id to the request to be used in next function
        next()
      })
      .catch(() => res.status(401).json({ message: 'Secure route. Caught error' }))
  })
}

module.exports = secureRoute