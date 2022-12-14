const mongoose = require('mongoose')

const popRankSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
    },
    articleAidList: [{
        type: String,
    }],
    temporalGranularity: {
        type: String
    }
})
  
module.exports = mongoose.model('popRank', popRankSchema, 'popRank')