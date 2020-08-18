

const mongoose = require('mongoose')

const idsSchema = new mongoose.Schema({
  user_id: Number
})

const Ids = mongoose.model('Ids', idsSchema)

Ids.findOne((err, data) => {
  if (!data) {
    const ids = new Ids({
      user_id: 0
    })
    ids.save()
  }
})



module.exports = Ids