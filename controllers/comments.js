const Discussion = require('../models/Discussion')
const Comment = require('../models/Comment')

function createComment(req, res) {
  req.body.user = req.currentUser
  Discussion
    .findById(req.params.id)
    .then(disc => {
      if (!disc) return res.status(404).json({ message: 'discussion not Found' })
      Comment
        .create(req.body)
        .then(comment => {
          //add user to users involved if not already
          if (!disc.users.includes(req.currentUser._id.toString())) disc.users.push(req.currentUser)
          // add comment to array
          disc.comments.push(comment)
          disc.save()
          res.status(201).json(disc)
        })
    })
    .catch(err => res.json(err))
}

function deleteComment(req, res) {
  Discussion
    .findById(req.params.id)
    .populate('comments')
    .then(disc => {
      if (!disc) return res.status(404).json({ message: 'discussion not Found' })
      //check comment exists
      const comment = disc.comments.find(element => element._id.toString() === req.params.commentId)
      if (!comment) return res.status(404).json({ message: 'comment not found' })
      //check it user is authorized
      if (!comment.user._id === req.currentUser._id) return res.status(401).json({ message: 'Unauthorized' })
      //remove comment
      const comments = disc.comments.filter(element => element._id === req.params.commentId)
      disc.comments = comments
      return disc.save()
    })
    .then(disc => res.status(202).json(disc))
    .catch(err => res.json(err))
}

function updateComment(req, res) {
  Discussion
    .findById(req.params.id)
    .populate('comments')
    .then(disc => {
      if (!disc) return res.status(404).json({ message: 'discussion not Found' })
      //check comment exists
      const comment = disc.comments.find(element => element._id.toString() === req.params.commentId)
      if (!comment) return res.status(404).json({ message: 'comment not found' })
      //check it user is authorized
      if (!comment.user._id === req.currentUser._id) return res.status(401).json({ message: 'Unauthorized. Comment not updated. ' })
      //update comment
      disc.comments.forEach((element, i) => {
        if (element._id.toString() === req.params.commentId) disc.comments[i].text = req.body.text
      })
      return disc.save()
    })
    .then(disc => res.status(202).json(disc))
    .catch(err => res.json(err))
}

module.exports = {
  createComment,
  deleteComment,
  updateComment
}