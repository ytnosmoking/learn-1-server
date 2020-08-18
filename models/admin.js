const mongoose = require('mongoose')



const Schema = mongoose.Schema



const adminSchema = new Schema({
  username: String,
  password: String,
  id: Number,
  create_time: String
})

// adminSchema.index({ id: 1 });
const Admin = mongoose.model('Admins', adminSchema)

module.exports = Admin