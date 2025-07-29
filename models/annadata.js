const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const annaDataSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cropType: {
        type: String,
        required: true,
        enum: ['Rice', 'Wheat', 'Corn', 'Sugarcane', 'Cotton', 'Potato', 'Tomato', 'Onion', 'Other']
    },
    landArea: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true
    },
    season: {
        type: String,
        required: true,
        enum: ['Kharif', 'Rabi', 'Zaid']
    },
    yieldExpected: {
        type: Number,
        min: 0
    },
    actualYield: {
        type: Number,
        min: 0
    },
    costInvested: {
        type: Number,
        min: 0
    },
    revenue: {
        type: Number,
        min: 0
    },
    profitLoss: {
        type: Number
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        enum: ['Planning', 'In Progress', 'Harvested', 'Sold'],
        default: 'Planning'
    },
    plantingDate: {
        type: Date
    },
    harvestDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

// Update the updatedAt field before saving
annaDataSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    
    // Calculate profit/loss if revenue and cost are provided
    if (this.revenue && this.costInvested) {
        this.profitLoss = this.revenue - this.costInvested;
    }
    
    next();
});

module.exports = mongoose.model("AnnaData", annaDataSchema);
