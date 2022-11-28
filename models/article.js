const mongoose = require('mongoose')
const marked = require('marked')
const { JSDOM } = require('jsdom')

const articleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  timestamp: {
    type: String
  },
  aid: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  category: {
    type: String
  },
  abstract: {
    type: String
  },
  articleTags: {
    type: String
  },
  authors: {
    type: String
  },
  language: {
    type: String
  },
  text: {
    type: String
  },
  image: {
    type: String
  },
  video:{
    type: String
  }
})



module.exports = mongoose.model('article', articleSchema, 'article')