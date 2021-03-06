const User = require('../models/User')

function getOfficials(req, res) {
  User
    .find({})
    .then(users => {
      const officials = users.filter(user => user.officialData !== null)
      res.status(200).json(officials)
    })
    .catch(err => res.json(err))
}

function updateOfficialData(req, res) {
  User
    .findById(req.params.id)
    .then(user => {
      if (!user) return res.status(404).json({ message: 'Official not found' })
      if (!user.officialData) return res.status(404).json({ message: 'officialData property is null' })
      console.log(user)
      user.officialData = Object.assign(user.officialData, req.body)
      user.save(err => {
        if (err) res.status(500).json({ message: 'could not save: ', err: err })
      })
      res.status(202).json(user)
    })
    .catch(err => res.json(err))
}

module.exports = {
  getOfficials,
  updateOfficialData
}