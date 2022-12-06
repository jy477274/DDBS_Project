const express = require('express')
const mongoose = require('mongoose')
var http = require("http")
var bodyParser = require('body-parser')

const Article = require('./models/article.js')
const Read = require('./models/read.js')
const User = require('./models/user.js')

const methodOverride = require('method-override')
const router = express.Router()
var current_user = 0

const app = express()


const connection_url = 'mongodb://localhost:27100/ddbs'
mongoose.connect(connection_url)

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(bodyParser.json())
app.use(methodOverride('_method'))

const db = mongoose.connection
db.once('open', _ =>{
  console.log('Database connected:', connection_url)
})
db.on('error', err =>{
  console.error('Connection error:', err)
})

//display all articles on the homepage (Works)
app.get('/', (req, res) =>{
  Article.find({}, (err, articles) =>{
    res.render('articles/index.ejs', {articles: articles})
  })
})
//display all articles on the homepage (Works)
app.get('/', (req, res) =>{
  res.sendFile('articles/index.ejs')
})

//get the current UID (default it UID:0)
//I think this needs 
app.use(function (req, res) {
  var post_data = req.body.user;
  current_user = post_data;
  console.log("Current UID:",current_user)
})
//redirect to the new article window (Works)
app.get('/new', (req, res) =>{
  res.render('articles/new.ejs', { article: new Article() })
})

//delete an article (CANNOT DELETE /id) --> now can delete
app.delete('/del/:aid', async (req, res) => {
  await Article.deleteOne({aid: req.params.aid})
  return res.redirect('/')
})

//show contents of an article (CANNOT GET /id) --> now can get
app.get('/show/:aid', async (req, res) => {
  const article = await Article.find({aid: req.params.aid}, )
  if (article == null) res.redirect('/')
  res.render('articles/show.ejs', { article: article[0] })
})

//show articles that a given user has read


//show popular articles(requires be read table)


app.use('/articles', router)

app.listen(3000)
