const ImgModel = require('../models/imgs')
const formidable = require('formidable');
const fs = require('fs')

const path = require('path')

const dtime = require('time-formater')

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

class Imgs {
  constructor() {
  }

  async getImgs(req, res, next) {
    try {
      console.log(req.query)
      const { page, pageSize } = req.query
      const lists = await ImgModel.aggregate([{
        $project: {
          _id: 0,
          id: 1,
          url: 1,
          dir: 1,
          name: 1,
        }
      }]).skip((page - 1) * pageSize / 1).limit(pageSize / 1)
      const total = await ImgModel.countDocuments()
      // const lists = await ImgModel.find({}).skip((page - 1) * pageSize / 1).limit(pageSize / 1)
      console.log(lists)
      res.send(successCode('成功找到', {
        lists, info: {
          page,
          pageSize,
          total
        }
      }))
    } catch (err) {
      console.log(err)
      res.send(errCode('找不到'))
    }
  }
  async uploadImg(req, res, next) {
    try {

      let UPLOAD_FOLDER = '/images';
      //创建上传表单

      var form = new formidable.IncomingForm(
        multiplesConf
      );
      form.multiples = true

      form.parse(req, (err, fields, files) => {
        if (err) {
          return res.send(errCode('内部服务器错误'))
        }
        // 上传 图片类型
        const fileType = {
          'image/pjpeg': 'jpg',
          'image/jpeg': 'jpg',
          'image/png': 'png',
          'image/x-png': 'png',
        }
        let urlArr = []

        const keyArr = Object.keys(files)
        keyArr.forEach((item, index) => {

          const cur = files[item]
          if (cur.size > form.maxFieldsSize) {
            fs.unlink(cur.path)
            return res.send(errCode('图片大小不能超过2M'))
          }
          const extName = fileType[cur.type]
          if (!extName) {
            return res.send(errCode('只支持png和jpg格式图片'))
          }
          const time = dtime().format('YYYY-MM-DD HH:mm:ss:SS')
          const originName = cur.name.split('.')[0]
          const newName = `${originName}_${time}.${extName}`
          const newPath = `${form.uploadDir}${UPLOAD_FOLDER}/${newName}`

          fs.rename(cur.path, newPath, async (err) => {
            if (err) {
              console.log(err)
              return res.send(errCode('图片上传失败', 401))
            } else {
              await ImgModel.create({
                url: newPath,
                dir: UPLOAD_FOLDER,
                name: newName,
                id: Date.now() + '',
                create_time: dtime().format('YYYY-MM-DD HH:mm:ss:SS'),
              })

              if (index === keyArr.length - 1) {
                console.log(urlArr)
                return res.send(successCode('图片上传成功 all', { url: urlArr }))
              }

            }
          })
          // }
        })

      })
    } catch (err) {
      console.log(err)
      res.send(successCode('上传失败'))
    }
  }
  async deleteImage(req, res, next) {
    try {
      const { id, url } = req.body
      const result = await ImgModel.deleteOne({ id })
      const stat = fs.unlinkSync(url)
      console.log(stat)
      res.send(successCode('成功删除'))
    } catch (err) {
      console.log(err)
      console.log('this is err deleteImage')
      res.send(errCode(err))
    }
  }
}


module.exports = new Imgs()