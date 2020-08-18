


const admin = require('./admin')
const users = require('./users')


module.exports = (app) => {
  app.use('/', admin)
  app.use('/users', users)
}