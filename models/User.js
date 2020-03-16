const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Player = require('./Player')
const Agent = require('./Agent')
const Official = require('./Official')

const userSchema = new mongoose.Schema({
  imageUrl: { type: String, required: false, default: null },
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: false, default: 'not specified' },
  nationality: { type: String, required: false, default: 'not specified' },
  transfers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transfer' }],
  agentData: { type: Agent.schema, default: null }, //{ type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }, //
  playerData: { type: Player.schema, default: null }, //{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  officialData: { type: Official.schema, default: null },
  connections: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
  connectionRequests: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
  sentRequests: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] }
}, {
  timestamps: true
})

userSchema.set('toJSON', {
  transform(doc, json) {
    delete json.password
    delete json.email
    return json
  }
})
  

userSchema
  .virtual('passwordConfirmation') // setting a virtual field on the model
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation
  })

userSchema
  .pre('validate', function checkPassword(next) { // runs before validation step
    if (this.isModified('password') && this._passwordConfirmation !== this.password) {
      this.invalidate('passwordConfirmation', 'does not match') // throw error if pass doesnt match
    }
    next()
  })

userSchema
  .pre('save', function hashPassword(next) { // this happens before model is saved if the password changes
    if (this.isModified('password')) {
      this.password = bcrypt.hashSync(this.password,
        bcrypt.genSaltSync(8)) // re assign as a hash of itself
    }
    next() // move on to saving
  })

userSchema
  .methods.validatePassword = function validatePassword(password) {
    return bcrypt.compareSync(password, this.password)
  }  

module.exports = mongoose.model('User', userSchema)