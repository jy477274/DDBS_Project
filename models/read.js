const mongoose = require('mongoose')

const readSchema = new mongoose.Schema({
    timestamp: {
      type: String
    },

    id: {
      type: String,
      required: true
    },
    uid: {
        type: String,
        required: true
    },
    aid: {
        type: String,
        required: true
    },
    readOrNot: {
        type: String
    },
    readTimeLength:{
        type: String
    },
    readSequence: {
        type: String
    },
    agreeOrNot:{
        type: String
    },
    commentOrNot:{
        type: String
    },
    shareOrNot:{
        type: String
    },
    commentDetail:{
        type: String
    },
    region: {
        type: String
    },
    category: {
        type: String
    },
    article_ts: {
        type: String
    }

  })
  
  
  module.exports = mongoose.model('read', readSchema, 'read')