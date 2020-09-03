const mongoose = require('mongoose')



const Schema = mongoose.Schema



const adminSchema = new Schema({
  username: String,
  nickname: String,
  user_id: Number,
  create_time: String,
  update_time: String,
  email: String,
  phone: String,
  wechat: String,
  avator: String
})

// adminSchema.index({ id: 1 });
const UserInfo = mongoose.model('UserInfo', adminSchema)

module.exports = UserInfo