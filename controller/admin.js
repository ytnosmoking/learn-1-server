const AdminModel = require('../models/admin')
const UserInfoModel = require('../models/uerInfo')
const IdsModel = require('../models/ids')
const crypto = require('crypto')
const Ids = require('../models/ids')
const dtime = require('time-formater')

const { sign, verify, successCode, errCode, createInfo } = require('../utils/tools')



class Admin {
  constructor() {
    this.user = {}
    this.checkAuth = this.checkAuth.bind(this)
    this.infos = this.infos.bind(this)
  }

  async checkAuth(req, res, next) {
    try {
      let token = req.headers['authorization']
      if (!token) {
        res.send(errCode('未登录'))
      }
      token = token.split(' ')[1]
      const user = await verify(token)
      this.user = user
      next()
    } catch (err) {
      console.log(`token不合法===` + 222)
      res.send(errCode('token不合法'))
    }
  }

  async login(req, res, next) {
    const { username, password, create } = req.body
    try {
      if (!username) {
        throw new Error('用户名参数错误')
      } else if (!password) {
        throw new Error('密码参数错误')
      }
    } catch (err) {
      console.log(err.message)
      res.send(errCode(err.message, 300))
    }

    try {
      const admin = await AdminModel.findOne({ username })
      if (!admin) {
        res.send(errCode('找不到用户', 401))
      }
      if (admin.password !== password) {
        res.send(errCode('密码错误'))
      }
      req.session.admin_id = admin.id;
      let info = await UserInfoModel.findOne({ user_id: admin.id })
      if (!info) {
        info = createInfo(admin.id)
        await UserInfoModel.create(info)
      }
      const token = await sign({ username, password })
      console.log(token)




      res.send(successCode('登录成功', { info, token }))

    } catch (err) {
      res.send(errCode('登录失败'))
    }
  }

  async register(req, res, next) {
    const { username, password } = req.body
    try {
      if (!username) {
        throw new Error('用户名参数错误')
      } else if (!password) {
        throw new Error('密码参数错误')
      }
    } catch (err) {
      console.log(err)
      res.errCode(err.message)

    }
    try {
      const admin = await AdminModel.findOne({ username })
      if (admin) {
        res.send(errCode('用户已经存在'))
      } else {
        const idData = await Ids.findOne()
        idData.user_id++
        console.log(idData)
        await idData.save()
        const newUser = {
          username,
          password,
          id: idData.user_id,
          create_time: dtime().format('YYYY-MM-DD HH:mm'),
        }
        await AdminModel.create(newUser)
        res.send(successCode('注册成功'))
      }
    } catch (err) {
      console.log(err)
      res.send(errCode('注册失败'))
    }
  }

  async infos(req, res, next) {
    try {
      const user_id = req.session.admin_id
      let info = await UserInfoModel.findOne({ user_id })
      if (!info) {
        info = createInfo(user_id)
        await UserInfoModel.create(info)
      }
      res.send(successCode('查询成功', { info }))
    } catch (err) {
      res.send(successCode('查询用户信息成功'))
    }

  }
}


module.exports = new Admin()