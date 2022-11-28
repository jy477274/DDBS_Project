const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
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
    name: {
        type: String,
    },
    gender: {
        type: String
    },
    email:{
        type: String
    },
    phone: {
        type: String
    },
    dept:{
        type: String
    },
    grade:{
        type: String
    },
    language:{
        type: String
    },
    region:{
        type: String
    },
    role: {
        type: String
    },
    preferTags: {
        type: String
    },
    obtainedCredits: {
        type: String
    }

  })
  
  
  module.exports = mongoose.model('user', userSchema, 'user')