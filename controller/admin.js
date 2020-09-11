const AdminModel = require('../models/admin')
const UserInfoModel = require('../models/uerInfo')
const IdsModel = require('../models/ids')
const crypto = require('crypto')

const dtime = require('time-formater')
const formidable = require('formidable');
const fs = require('fs');

const { sign, verify, successCode, errCode, createInfo } = require('../utils/tools')


const config = {
  UPLOAD_FOLDER: '/images',

  encoding: 'utf-8',
  uploadDir: './public',
  keepExtensions: true,
  maxFieldsSize: 2 * 1024 * 1024,
}
const multiplesConf = {
  multiples: true,
  ...config
}

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
      // console.log(err)
      let msg = 'token不合法'
      if (err && err.message.includes('jwt expired')) {
        msg = '超时，重新登录'
      }
      console.log(msg)
      res.send(errCode(msg))
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
        const idData = await IdsModel.findOne()
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
  async updateInfos(req, res, next) {
    try {
      let UPLOAD_FOLDER = '/images';
      //创建上传表单

      var form = new formidable.IncomingForm(
        multiplesConf
      );
      form.multiples = true

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.send(errCode('内部服务器错误'))
        }
        let avator = null
        if (files.avator) {
          avator = files.avator
          delete files.avator
          // 上传 图片类型
          const fileType = {
            'image/pjpeg': 'jpg',
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/x-png': 'png',
          }
          if (avator.size > form.maxFieldsSize) {
            fs.unlink(cur.path)
            return res.send(errCode('图片大小不能超过2M'))
          }
          const extName = fileType[avator.type]
          if (!extName) {
            return res.send(errCode('只支持png和jpg格式图片'))
          }
          const time = dtime().format('YYYY-MM-DD HH:mm:ss:SS')
          const originName = avator.name.split('.')[0]
          const newName = `${originName}_${time}.${extName}`
          const newPath = `${form.uploadDir}${UPLOAD_FOLDER}/${newName}`
          fs.rename(avator.path, newPath, async (err) => {
            if (err) {
              console.log(err)
              return res.send(errCode('图片上传失败', 401))
            } else {
              const user_id = req.session.admin_id
              const oldInfo = await UserInfoModel.findOne({ user_id })
              // fs.unlinkSync(`${form.uploadDir}${oldInfo.avator}`)
              await UserInfoModel.updateOne({ user_id }, {
                ...fields, avator: `${UPLOAD_FOLDER}/${newName}`,
                update_time: dtime().format('YYYY-MM-DD HH:mm:ss:SS')
              })
              const info = await UserInfoModel.findOne({ user_id })
              res.send(successCode('跟新成功', { info }))
            }
          })
        } else {
          const user_id = req.session.admin_id
          await UserInfoModel.updateOne({ user_id }, {
            ...fields,
            update_time: dtime().format('YYYY-MM-DD HH:mm:ss:SS'),
          })
          const info = await UserInfoModel.findOne({ user_id })
          res.send(successCode('跟新成功', { info }))
        }

      })

    } catch (err) {
      console.log(err)
      res.send(errCode(err))
    }
  }

}


module.exports = new Admin()