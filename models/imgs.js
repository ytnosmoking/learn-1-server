const mongoose = require('mongoose')



const Schema = mongoose.Schema



const imgSchema = new Schema({
  url: String,
  dir: String,
  name: String,
  id: String,
  create_time: String
})

const Img = mongoose.model('imgs', imgSchema)

module.exports = Img