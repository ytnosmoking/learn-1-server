

const mongoose = require('mongoose')


const config = require('../config')
const chalk = require('chalk')


mongoose.connect(config.url, { useUnifiedTopology: true, useNewUrlParser: true })


const db = mongoose.connection

db.once('open', () => {
  console.log(chalk.green('数据库 连接成功'))
})

db.on('error', (error) => {
  console.error(chalk.red(`Error   --- ${error}`))
})

db.on('close', () => {
  console.log(chalk.red('db 断开 准备 重新连接'))
  mongoose.connect(config.url, { server: { auto_reconnect: true } })
})
module.exports = db