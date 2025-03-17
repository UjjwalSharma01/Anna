require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose"); 
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
const forumRouter = require("./routes/forum.js");
const annadataRouter = require("./routes/annadata.js");
const cors = require('cors');

// Connect to MongoDB using the environment variable
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB Atlas");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

// Middleware Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add JSON parsing middleware

// Static file serving with security headers and CORS
const staticFileOptions = {
  dotfiles: 'deny',
  etag: true,
  maxAge: '1d',
  setHeaders: (res, path) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (path.endsWith('.jpg') || path.endsWith('.png')) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
};

// Serve static files with proper CORS headers
app.use('/static', express.static(path.join(__dirname, 'public'), staticFileOptions));
app.use('/images', express.static(path.join(__dirname, 'public/images'), staticFileOptions));

// Serve React app's public files with CORS headers enabled
app.use(express.static(path.join(__dirname, 'annadata-frontend/public'), {
  dotfiles: 'ignore',
  etag: true,
  maxAge: '1d',
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}));

// Handle missing images with default fallback
app.get(['/static/*', '/images/*'], (req, res) => {
  if (req.path.match(/\.(jpg|png|ico)$/)) {
    res.sendFile(path.join(__dirname, 'public/static/images/default.jpg'));
  } else {
    res.status(404).json({ message: 'Resource not found' });
  }
});

// Update CORS configuration for all routes
app.use(cors({
    origin: [
      'http://localhost:3000',
      'https://fuzzy-space-fiesta-gjv5vpwq4w7f6vg-3000.app.github.dev',
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET || "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}));

// Authentication setup
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// API routes with prefix
app.use("/api/home", (req, res) => {
    // Basic home data for testing connections
    res.json({
        hero: {
            title: "Welcome to Annadata",
            description: "Your platform for agricultural resources",
            imageUrl: "/images/default.jpg" // Changed from hero.jpg to default.jpg which exists
        },
        featuredSchemes: [],
        latestQuestions: []
    });
});

// Add API endpoint for schemes
app.use("/api/schemes", (req, res) => {
    // Mock data for schemes to test the connection
    res.json({
        schemes: [
            {
                _id: "scheme1",
                title: "Pradhan Mantri Kisan Samman Nidhi",
                description: "Income support to farmers",
                category: "Government Scheme",
                imageUrl: "/images/pm-kisan.jpg"
            },
            {
                _id: "scheme2",
                title: "Pradhan Mantri Fasal Bima Yojana",
                description: "Crop insurance scheme",
                category: "Insurance",
                imageUrl: "/images/pmfby.jpg"
            },
            {
                _id: "scheme3",
                title: "Kisan Credit Card",
                description: "Credit for agricultural activities",
                category: "Finance",
                imageUrl: "/images/kcc.jpg"
            }
        ]
    });
});

// Add API endpoint for forum
app.use("/api/forum/questions", (req, res) => {
  // Mock data for forum questions
  res.json({
    questions: [
      {
        _id: "q1",
        title: "How to increase crop yield?",
        content: "I'm having trouble with my wheat crop yield. Any suggestions?",
        author: { name: "Farmer123", avatarUrl: "" },
        createdAt: new Date().toISOString(),
        tags: ["crops", "yield", "wheat"],
        upvotes: 5,
        answers: []
      },
      {
        _id: "q2",
        title: "Best practices for organic farming",
        content: "Looking for advice on transitioning to organic farming methods.",
        author: { name: "OrganicGrower", avatarUrl: "" },
        createdAt: new Date().toISOString(),
        tags: ["organic", "sustainable"],
        upvotes: 10,
        answers: []
      }
    ]
  });
});

app.use("/api/forum/user/questions", (req, res) => {
  // Mock data for user's questions
  res.json({
    questions: [
      {
        _id: "q1",
        title: "How to increase crop yield?",
        content: "I'm having trouble with my wheat crop yield. Any suggestions?",
        createdAt: new Date().toISOString(),
        tags: ["crops", "yield", "wheat"],
        upvotes: 5,
        answers: []
      }
    ]
  });
});

// Routes setup
app.use("/annadata", annadataRouter);
app.use("/annadata/:id", forumRouter);
app.use("/", userRouter);

// Error handling middleware
app.all("*", (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ message: "API endpoint not found" });
    }
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    
    if (req.path.startsWith('/api')) {
        return res.status(statusCode).json({ message });
    }
    
    res.status(statusCode).render("error.ejs", { message });
});

// Start the server
app.listen(process.env.PORT || 5050, () => {
    console.log(`Server is running on port ${process.env.PORT || 5050}`);
});
