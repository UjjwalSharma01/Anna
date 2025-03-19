const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  upvotes: {
    type: Number,
    default: 0
  },
  upvotedBy: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const forumSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  upvotes: {
    type: Number,
    default: 0
  },
  upvotedBy: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  answers: [answerSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    enum: ['Agricultural Commodity', 'Agricultural Product', 'Crop Insurance', 
           "Farmer's Issues", 'Livestock and Animal Husbandry', 'Organic Farming', 
           'Schemes and Subsidies', 'Other'],
    default: 'Other'
  }
});

module.exports = mongoose.model("Forum", forumSchema);
