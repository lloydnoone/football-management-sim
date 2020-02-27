const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/squadron'
const port = process.env.PORT || 8888
const secret = process.env.SECRET || 'Shhhh it\'s a secret'

module.exports = { dbURI, port, secret }