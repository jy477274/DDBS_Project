const mongoose = require('mongoose')

const bereadSchema = new mongoose.Schema({
    _id: {
      type: String,
      required: true
    },
    category: {
        type: String
    },
    timestamp : {
        type: String
    },
    readNum: {
        type: Number
    },
    readUidList: [{
        type: String
    }],
    commentNum: {
        type: Number
    },
    commentUidList: [{
        type: String
    }],
    agreeNum: {
        type: Number
    },
    agreeUidList: [{
        type: String
    }],
    shareNum: {
        type: Number
    },
    shareUidList: [{
        type: String
    }],
    aid: {
        type: String
    }
  })
  
  
  module.exports = mongoose.model('beRead', bereadSchema, 'beRead')