

const jwt = require('jsonwebtoken')
const config = require('../config')
const dtime = require('time-formater')

const sign = (user) => jwt.sign(user, config.jwt, {
  expiresIn: 60 * 5
})

const verify = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt, (err, decoded) => {
      console.log('verify')
      console.log(err)
      if (err) {
        reject(err.message)
      }
      resolve(decoded)
    })
  })
}

const successCode = (msg = "成功", other = {}) => ({
  status: 200,
  message: msg,
  ...other
})
const errCode = (msg = "失败", code = 300, other = {}) => ({
  status: code,
  message: msg,
  ...other
})

const createInfo = (user_id) => ({
  username: '默认 username',
  nickname: '默认 username',
  user_id,
  create_time: dtime().format('YYYY-MM-DD HH:mm'),
  email: '默认 email',
  phone: '13995694467',
  wechat: 'qwescsd',
  avator: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1597654689&di=a0942dfed7420ab4c9c28c5dff861f41&src=http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg'
})


module.exports = {
  sign,
  verify,
  successCode,
  errCode,
  createInfo
}