const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemeSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: '/images/default.jpg'
  },
  eligibility: {
    type: String
  },
  benefits: {
    type: String
  },
  applicationProcess: {
    type: String
  },
  documentRequired: [String],
  deadline: {
    type: Date
  },
  website: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Scheme', schemeSchema);
