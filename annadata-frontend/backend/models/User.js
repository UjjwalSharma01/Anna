const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  land_area: {
    type: Number,
    default: 0
  },
  income: {
    type: Number,
    default: 0
  },
  bio: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: '/images/default-avatar.jpg'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash the password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT
userSchema.methods.generateToken = function() {
  return jwt.sign(
    { id: this._id, username: this.username }, 
    process.env.JWT_SECRET || 'mysupersecretjwtkey',
    { expiresIn: '7d' }
  );
};

module.exports = mongoose.model('User', userSchema);
