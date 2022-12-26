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
const BeRead = require('./models/beread.js')
const PopRank = require('./models/poprank.js')

const { render } = require('ejs')
const { GridFsStorage } = require('multer-gridfs-storage/lib/gridfs.js')
const router = express.Router()

const app = express()

const connection_url = 'mongodb://localhost:27100/ddbs'
const gridfs_url = 'mongodb://localhost:27101/gridfs'
mongoose.connect(connection_url)
const grid_connect = mongoose.createConnection(gridfs_url)

// middleware
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(bodyParser.json())
app.use(methodOverride('_method'))

// connect to structured data db
const db = mongoose.connection
db.once('open', _ =>{
  console.log('Database connected:', connection_url)
})
db.on('error', err =>{
  console.error('Connection error:', err)
})

//connect to GridFS and store reference
let gridfs
grid_connect.once('open', () =>{

  gridfsBucket = new mongoose.mongo.GridFSBucket(grid_connect.db);
  gridfs = Grid(grid_connect.db, mongoose.mongo)
  console.log("Connected to gridfs on:", gridfs_url)
})

function QuickSortArticles(arr, left = 0, right = arr.length - 1) {
  let len = arr.length,
  index
  if(len > 1) {
    index = partition(arr, left, right)
  if(left < index - 1) {
    QuickSortArticles(arr, left, index - 1)
  }
  if(index < right) {
    QuickSortArticles(arr, index, right)
  }
  }
    return arr
  }
  function partition(arr, left, right) {
    let middle = Math.floor((right + left) / 2),
    pivot = Number(arr[middle].aid),
    i = left, // Start pointer at the first item in the array
    j = right // Start pointer at the last item in the array
    while(i <= j) {
      // Move left pointer to the right until the value at the
      // left is greater than the pivot value
      while(Number(arr[i].aid) < pivot) {
        i++
      }
      // Move right pointer to the left until the value at the
      // right is less than the pivot value
      while(Number(arr[j].aid) > pivot) {
        j--
      }
      // If the left pointer is less than or equal to the
      // right pointer, then swap values
      if(i <= j) {
        [arr[i], arr[j]] = [arr[j], arr[i]] // ES6 destructuring swap
        i++
        j--
      }
    }
    return i
  }

current_user=0
//display all articles on the homepage (Works)
app.get('/', (req, res) =>{
  Article.find({}, (err, articles) =>{
    const pageCount = Math.ceil(articles.length / 20);
    let page = parseInt(req.query.p);
    if (!page) { page = 1;}
    if (page > pageCount) {
      page = pageCount
    }
    QuickSortArticles(articles)
    res.render('articles/index.ejs', {
      articles: articles, 
      user_id: current_user,
      "page": page,
      "pageCount": pageCount,
      "posts": articles.slice(page * 20 - 20, page * 20)
    })
  })
  if (req.query.user_id != null){
    current_user = req.query.user_id
  }
})


//redirect to user-read page and send in articles grouped by UID
//displays one article and then throws
app.get('/read', (req, res) =>{
  if (current_user==null){
    user = ""
  }
  else {
    user = current_user
  }
  Read.find({uid:  user.toString()}, (err, reads) => {
    Article.find({aid: reads.map(r => r.aid)}, (err, articles)=> {
      QuickSortArticles(articles)
      res.render('articles/read.ejs', { articles: articles, user_id:  current_user })
    })
  })
})

app.get('/popRankDaily', (req, res) => {
  temporalGranularity = 'Daily'
  PopRank.find({temporalGranularity: temporalGranularity.toLowerCase()}, (err, popRankArticles) => {
    Article.find({aid: popRankArticles[0].articleAidList}, (err, articles)=>{
      QuickSortArticles(articles)
      res.render('articles/poprank.ejs', { articles: articles, user_id:  current_user, temporalGranularity })
    })
  })
})
app.get('/popRankWeekly', (req, res) => {
  temporalGranularity = 'Weekly'
  PopRank.find({temporalGranularity: temporalGranularity.toLowerCase ()}, (err, popRankArticles) => {
    Article.find({aid: popRankArticles[0].articleAidList}, (err, articles)=>{
      QuickSortArticles(articles)
      res.render('articles/poprank.ejs', { articles: articles, user_id:  current_user , temporalGranularity})
    })
  })
})
app.get('/popRankMonthly', (req, res) => {
  temporalGranularity= 'Monthly'
  PopRank.find({temporalGranularity: temporalGranularity.toLowerCase () }, (err, popRankArticles) => {
    Article.find({aid: popRankArticles[0].articleAidList}, (err, articles)=>{
      QuickSortArticles(articles)
      res.render('articles/poprank.ejs', { articles: articles, user_id:  current_user, temporalGranularity})
    })
  })
})

//delete an article (CANNOT DELETE /id) --> now can delete
app.delete('/del/:aid', async (req, res) => {
  await Article.deleteOne({aid: req.params.aid})
  return res.redirect('/')
})
//show contents of an article (CANNOT GET /id) --> now can get
let read_count = 0
app.get('/show/:aid', async (req, res) => {
  const article = await Article.find({aid: req.params.aid}, )
  const user = await User.find({uid: current_user}, )
  
  if (article == null) res.redirect('/')
  //get the comment detail from read entries for the given article
  const read_article = await Read.find({aid: article[0].aid}, )

  //save an entry to the read table for this article and user
  var read1 = new Read({
    timestamp: Date.now().toString(),
    id: "R"+read_count.toString(),
    uid: current_user.toString(),
    aid: article[0].aid.toString(),
    readTimeLength: "10",
    agreeOrNot: "0",
    commentOrNot: "0",
    shareOrNot: "0",
    commentDetail: read_article[0].commentDetail,
    region: user[0].region,
    category: article[0].category,
    article_ts: article[0].timestamp
  })
  read_count = read_count + 1

  read1.save(function (err, read){
    if(err) return console.error(err)
    console.log("Read saved successfully")
  })

  //get the article text file name
  const article_text = article[0].text

  //read the contents of the file from gridfs
  const text_file = await gridfs.files.findOne({filename:article_text})
  var buffer = ""
  var readStream = gridfsBucket.openDownloadStream(text_file._id)

  readStream.on('data', function(chunk){
    buffer += chunk
  })

  //when finished grabbng all of the text chunks, show on console
  readStream.on('end', function(){
    res.render('articles/show.ejs', { 
      article: article[0],
      text:buffer}) 

  })
})

app.use('/articles', router)

app.listen(3000)
