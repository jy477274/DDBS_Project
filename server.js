const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article.js')
const Read = require('./models/read.js')
const User = require('./models/user.js')
const methodOverride = require('method-override')
const router = express.Router()

const app = express()


const connection_url = 'mongodb://localhost:27100/ddbs'
mongoose.connect(connection_url)

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
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

//redirect to the new article window (Works)
app.get('/new', (req, res) =>{
  res.render('articles/new.ejs', { article: new Article() })
})

//delete an article (CANNOT DELETE /id)
router.delete('/id', async (res, req) => {
  await Article.delete({aid: req.params.id})
  return res.redirect('/')
})

//show contents of an article (CANNOT GET /id)
router.get('/id', async (req, res) => {
  const article = await Article.find({aid: req.params.id})
  if (article == null) res.redirect('/')
  res.render('articles/show.ejs', { article: article })
})


app.use('/articles', router)

app.listen(3000)
