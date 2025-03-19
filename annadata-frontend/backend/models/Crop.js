const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cropSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropType: {
    type: String,
    required: true
  },
  area: {
    type: Number,
    required: true,
    default: 0
  },
  plantingDate: {
    type: Date,
    required: true
  },
  expectedHarvestDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Planting', 'Growing', 'Harvesting', 'Completed'],
    default: 'Planting'
  },
  notes: {
    type: String
  },
  estimatedYield: {
    type: Number
  },
  actualYield: {
    type: Number
  },
  expenses: [{
    item: String,
    cost: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Crop', cropSchema);
