


const admin = require('./admin')
const users = require('./users')
const movie = require('./movie')

module.exports = (app) => {
  app.use('/', admin)
  app.use('/users', users)
  app.use('/movie', movie)
}