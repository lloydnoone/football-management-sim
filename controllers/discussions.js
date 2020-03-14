const Discussion = require('../models/Discussion')

function createDiscussion(req, res) {
  req.body.owner = req.currentUser
  Discussion
    .create(req.body)
    .then(disc => res.status(201).json(disc))
    .catch(err => res.json(err))
}

function getDiscussions(req, res) {
  Discussion
    .find({})
    .then(discs => res.status(200).json(discs))
    .catch(err => res.json(err))
}

function getDiscussion(req, res) {
  Discussion
    .find({ _id: req.params.id })
    .populate([{
      path: 'comments',
      model: 'Comment'
    },
    {
      path: 'owner',
      model: 'User'
    }])
    .then(disc => res.status(200).json(disc))
    .catch(err => res.json(err))
}

function deleteDiscussion(req, res) {
  Discussion
    .findByIdAndRemove(req.params.id, () => res.sendStatus(204))
    .catch(err => res.json(err))
}

function updateDiscussion(req, res) {
  Discussion
    .findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }) // set this to get the updated copy instead of the old one.
    .then(user => res.status(202).json(user))
    .catch(err => res.json(err))
}

function getUsersDiscussions(req, res) {
  Discussion
    .find({ owner: req.params.id })
    .then(chats => res.status(200).json(chats))
    .catch(err => res.json(err))
}

module.exports = {
  createDiscussion,
  getDiscussions,
  deleteDiscussion,
  updateDiscussion,
  getDiscussion,
  getUsersDiscussions
}