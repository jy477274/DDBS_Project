const express = require('express')
const mongoose = require('mongoose')
var http = require("http")
var bodyParser = require('body-parser')
const methodOverride = require('method-override')
const multer = require('multer')
const GridFSStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const fs = require('fs')

//mongoose models for structured data
const Article = require('./models/article.js')
const Read = require('./models/read.js')
const User = require('./models/user.js')

const { render } = require('ejs')
const { GridFsStorage } = require('multer-gridfs-storage/lib/gridfs.js')
const router = express.Router()

var current_user = 0

const app = express()


const connection_url = 'mongodb://localhost:27100/ddbs'
const gridfs_url = 'mongodb://localhost:27101/gridfs'
mongoose.connect(connection_url)
const grid_connect = mongoose.createConnection(gridfs_url)

//middleware
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(bodyParser.json())
app.use(methodOverride('_method'))


//connect to structured data db
const db = mongoose.connection
db.once('open', _ =>{
  console.log('Database connected:', connection_url)
})
db.on('error', err =>{
  console.error('Connection error:', err)
})

//connect to GridFS and store reference
//The bucket is the new way to access data since accessing from
//gridfs-stream directly is deprecated
let gridfs
grid_connect.once('open', () =>{

  gridfsBucket = new mongoose.mongo.GridFSBucket(grid_connect.db);
  gridfs = Grid(grid_connect.db, mongoose.mongo)
  console.log("Connected to gridfs on:", gridfs_url)
})



//display all articles on the homepage (Works)
app.get('/', (req, res) =>{
  Article.find({}, (err, articles) =>{
    res.render('articles/index.ejs', {articles: articles})
  })
})


//redirect to user-read page and send in articles grouped by UID
//displays one article and then throws
//currently works for UID:0
app.get('/read', (req, res) =>{
  Read.find({uid: current_user.toString()}, (err, reads) => {
    Article.find({aid: reads.map(r => r.aid)}, (err, articles)=> {
      res.render('articles/read.ejs', { articles: articles })
    })
  })
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

  //get the article text file name
  const article_text = article[0].text

  //read the contents of the file from gridfs
  const file = await gridfs.files.findOne({filename:article_text})
  var buffer = ""
  var readStream = gridfsBucket.openDownloadStream(file._id)

  readStream.on('data', function(chunk){
    buffer += chunk
  })

  //when finished grabbng all of the chunks, show on console
  readStream.on('end', function(){
    res.render('articles/show.ejs', { 
      article: article[0],
      text:buffer})
  })

  
})

//show articles that a given user has read


//show popular articles(requires be read table)


app.use('/articles', router)

app.listen(3000)
