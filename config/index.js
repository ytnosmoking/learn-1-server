


const config = {
  port: parseInt(process.env.PORT, 10) || 8001,
  url: 'mongodb://127.0.0.1/learn-1',
  jwt: 'myjwttest',
  session: {
    name: 'SID',
    secret: 'SID',
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    }
  }
}
module.exports = config