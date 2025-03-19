# Backend Dependencies

This document provides an overview of the key dependencies used in the Annadata backend and explains their roles in the system.

## Core Backend Dependencies

### Express.js
**Package**: `express`  
**Purpose**: Web application framework for Node.js  
**Usage in Annadata**: Core server framework that handles HTTP requests/responses, routing, and middleware.

```javascript
const express = require('express');
const app = express();

// Set up routes
app.use('/api/auth', authRoutes);
app.use('/api/forum', forumRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Mongoose
**Package**: `mongoose`  
**Purpose**: MongoDB object modeling tool  
**Usage in Annadata**: Provides schema validation, query building, and business logic hooks for MongoDB.

```javascript
const mongoose = require('mongoose');

// Define schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  // other fields...
});

// Connect to database
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
```

### bcryptjs
**Package**: `bcryptjs`  
**Purpose**: Password hashing library  
**Usage in Annadata**: Securely hashes user passwords before storing them in the database and provides functions to compare passwords during authentication.

```javascript
// Hash password before saving
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

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

### JSON Web Token
**Package**: `jsonwebtoken`  
**Purpose**: Implementation of JSON Web Tokens  
**Usage in Annadata**: Generates and verifies authentication tokens for secure user sessions.

```javascript
// Generate token
userSchema.methods.generateToken = function() {
  return jwt.sign(
    { id: this._id, username: this.username }, 
    process.env.JWT_SECRET || 'mysupersecretjwtkey',
    { expiresIn: '7d' }
  );
};

// Verify token in auth middleware
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### CORS
**Package**: `cors`  
**Purpose**: Cross-Origin Resource Sharing middleware  
**Usage in Annadata**: Enables secure cross-origin requests between the frontend and backend.

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://annadata-production-frontend.com' 
    : ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### dotenv
**Package**: `dotenv`  
**Purpose**: Environment variable management  
**Usage in Annadata**: Loads configuration variables from .env files into process.env.

```javascript
require('dotenv').config();

// Access environment variables
const PORT = process.env.PORT || 5050;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
```

## API & Integration Dependencies

### Axios
**Package**: `axios`  
**Purpose**: Promise-based HTTP client  
**Usage in Annadata**: Makes requests to external APIs (like weather services) from the backend.

```javascript
const axios = require('axios');

// Weather API request
const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
  params: {
    lat,
    lon,
    appid: process.env.WEATHER_API_KEY,
    units: 'metric'
  }
});
```

## Development Dependencies

### Nodemon
**Package**: `nodemon`  
**Purpose**: Automatic server restart during development  
**Usage in Annadata**: Monitors file changes and automatically restarts the server, enhancing the development workflow.

```json
// In package.json
"scripts": {
  "dev": "nodemon server.js"
}
```

### http-proxy-middleware
**Package**: `http-proxy-middleware`  
**Purpose**: Proxy middleware for development  
**Usage in Annadata**: In development, proxies API requests from the React frontend to the Node.js backend server.

```javascript
// In setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5050',
      changeOrigin: true,
    })
  );
};
```

## Authentication Dependencies

### Passport
**Package**: `passport`, `passport-local`, `passport-local-mongoose`  
**Purpose**: Authentication middleware for Node.js  
**Usage in Annadata**: Alternative authentication strategy used in the original app.js implementation.

```javascript
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
```

## Error Handling and Utilities

### Express Session
**Package**: `express-session`  
**Purpose**: Session middleware for Express  
**Usage in Annadata**: Manages session data for traditional authentication (used in the original implementation).

```javascript
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET || "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));
```

### Connect Flash
**Package**: `connect-flash`  
**Purpose**: Flash messages middleware  
**Usage in Annadata**: Stores temporary messages for display to the user (used in the original implementation).

```javascript
const flash = require('connect-flash');

app.use(flash());

// Usage
req.flash("success", "Successfully logged in!");
```

### Method Override
**Package**: `method-override`  
**Purpose**: Override HTTP methods  
**Usage in Annadata**: Allows clients that don't support all HTTP verbs (like browsers with forms) to use methods like PUT and DELETE.

```javascript
const methodOverride = require('method-override');

app.use(methodOverride('_method'));

// HTML form can now use PUT/DELETE:
// <form method="POST" action="/resource?_method=DELETE">
```

## Why We Chose These Dependencies

1. **Reliability**: All chosen packages are well-maintained with large community support
2. **Security**: Libraries like bcrypt and jsonwebtoken follow security best practices
3. **Performance**: Packages like mongoose are optimized for performance
4. **Developer Experience**: Tools like nodemon improve the development workflow
5. **Integration**: The dependencies work well together in the Express ecosystem

## Dependency Management Best Practices

1. **Keep dependencies up-to-date**: Regularly update packages to receive security fixes
2. **Use specific versions**: Lock dependencies to specific versions to ensure consistency
3. **Minimize dependencies**: Only add dependencies when necessary to reduce security risks and bundle size
4. **Audit regularly**: Run `npm audit` to check for vulnerabilities
5. **Review documentation**: Understand how to properly use each dependency
