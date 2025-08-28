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
const cors = require("cors");
const { generateToken, authenticateJWT } = require("./utils/jwtUtils");
const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");
const Forum = require("./models/forum.js");
const userRouter  = require("./routes/user.js");
const forumRouter = require("./routes/forum.js");
const annadataRouter = require("./routes/annadata.js");
const apiAuthRouter = require("./routes/apiAuth.js");
const apiForumRouter = require("./routes/apiForum.js");
const apiAnnadataRouter = require("./routes/apiAnnadata.js");

//connect to MongoDB
mongoose.connect("mongodb+srv://admin:1234@cluster0.vn9sblt.mongodb.net/")
    .then(() => {
        console.log("Connected to MongoDB Atlas");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

// CORS Configuration
app.use(cors({
    origin: [
        'https://improved-fiesta-x7g9g4qwwqg2v4pg-3000.app.github.dev',
        'http://localhost:3000',
        'http://localhost:3001'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// JSON parsing middleware for API routes
app.use('/api', express.json());

//MiddleWare Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"views")))
app.engine('ejs', ejsMate);

//session
app.use(session({
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; // Make the current user available in all views
    next();
});

// API Routes (New - for React frontend) - MUST COME FIRST!
console.log("Mounting API routes...");
app.use("/api/auth", apiAuthRouter);
app.use("/api/forum", apiForumRouter);
app.use("/api/annadata", apiAnnadataRouter);

// Simple test route to verify API is working
app.get("/api/auth/test", (req, res) => {
    res.json({ message: "Auth API route is working!" });
});

// Test API endpoint
app.get("/api/test", (req, res) => {
    res.json({ message: "API is working!", timestamp: new Date() });
});

// Test POST endpoint
app.post("/api/test-post", (req, res) => {
    console.log("Test POST hit, body:", req.body);
    res.json({ 
        message: "POST is working!", 
        body: req.body, 
        timestamp: new Date() 
    });
});

// Current Routes (EJS - will keep during transition) - AFTER API ROUTES
app.use("/annadata", annadataRouter);
app.use("/annadata/:id", forumRouter);
// Move userRouter to the end since it has "/" catch-all

// User Signup API endpoint
app.post("/api/auth/signup", async (req, res) => {
    console.log("Signup API hit, body:", req.body);
    try {
        const { username, email, password, location, land_area, income } = req.body;
        
        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Username, email, and password are required"
            });
        }

        // Create new user
        const newUser = new User({ username, email, location, land_area, income });
        const registeredUser = await User.register(newUser, password);

        // Generate JWT token
        const { generateToken } = require("./utils/jwtUtils");
        const token = generateToken(registeredUser._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: {
                    id: registeredUser._id,
                    username: registeredUser.username,
                    email: registeredUser.email,
                    location: registeredUser.location,
                    land_area: registeredUser.land_area,
                    income: registeredUser.income
                },
                token: token
            },
            timestamp: new Date()
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Error creating user",
            timestamp: new Date()
        });
    }
});

// User Login API endpoint
app.post("/api/auth/login", async (req, res) => {
    console.log("Login API hit, body:", req.body);
    try {
        const { username, password } = req.body;
        
        // Validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        // Find user and authenticate
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        // Use passport-local-mongoose authenticate method
        const result = await new Promise((resolve, reject) => {
            user.authenticate(password, (err, user, passwordErr) => {
                if (err) reject(err);
                else if (passwordErr) resolve({ user: false, error: passwordErr });
                else resolve({ user, error: null });
            });
        });

        if (!result.user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        // Generate JWT token
        const { generateToken } = require("./utils/jwtUtils");
        const token = generateToken(result.user._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: result.user._id,
                    username: result.user.username,
                    email: result.user.email,
                    location: result.user.location,
                    land_area: result.user.land_area,
                    income: result.user.income
                },
                token: token
            },
            timestamp: new Date()
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Login failed",
            timestamp: new Date()
        });
    }
});

// Protected API endpoint (requires JWT token)
app.get("/api/user/profile", authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "Profile retrieved successfully",
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    location: user.location,
                    land_area: user.land_area,
                    income: user.income
                }
            },
            timestamp: new Date()
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving profile",
            timestamp: new Date()
        });
    }
});

// API Schemes Refresh endpoint - for manual data refresh
app.post("/api/schemes/refresh", (req, res) => {
    try {
        // For now, return the same static data with updated timestamp
        // External API integration will be added in next step
        const refreshedData = {
            government_schemes: [
                "PM-KISAN", 
                "Soil Health Card", 
                "Pradhan Mantri Fasal Bima Yojana",
                "Rashtriya Krishi Vikas Yojana",
                "National Mission for Sustainable Agriculture"
            ],
            ngos: [
                "Akshaya Patra", 
                "Smile Foundation", 
                "HelpAge India",
                "Art of Living",
                "Bharti Foundation"
            ]
        };
        
        res.json({
            success: true,
            message: "Schemes data refreshed successfully",
            data: refreshedData,
            lastUpdated: new Date(),
            source: "manual_refresh"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error refreshing schemes data",
            error: error.message
        });
    }
});

// API Dashboard/Index endpoint
app.get("/api/annadata", authenticateJWT, async (req, res) => {
    console.log("Dashboard API hit, user:", req.user);
    try {
        // Get dashboard data for the authenticated user
        const user = await User.findById(req.user.userId).select('-password');
        console.log("User found:", user);
        
        res.json({
            success: true,
            message: "Dashboard data retrieved successfully",
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    location: user.location,
                    land_area: user.land_area,
                    income: user.income
                },
                stats: {
                    userPosts: 0,  // Simplified for now
                    totalPosts: 1  // Simplified for now
                }
            },
            timestamp: new Date()
        });

    } catch (error) {
        console.log("Dashboard API error:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving dashboard data",
            error: error.message,
            timestamp: new Date()
        });
    }
});

// Forum API Endpoints

// Get all forum posts
app.get("/api/forum", async (req, res) => {
    try {
        const allPosts = await Forum.find({})
            .populate('author', 'username email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            message: "Forum posts retrieved successfully",
            data: {
                posts: allPosts,
                count: allPosts.length
            },
            timestamp: new Date()
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving forum posts",
            error: error.message,
            timestamp: new Date()
        });
    }
});

// Create new forum post (protected route)
app.post("/api/forum", authenticateJWT, async (req, res) => {
    try {
        const { Question, Description, Category } = req.body;

        // Validation
        if (!Question || !Description || !Category) {
            return res.status(400).json({
                success: false,
                message: "Question, Description, and Category are required"
            });
        }

        // Create new forum post
        const newForum = new Forum({
            Question,
            Description,
            Category,
            author: req.user.userId
        });

        await newForum.save();
        
        // Populate author details for response
        await newForum.populate('author', 'username email');

        res.status(201).json({
            success: true,
            message: "Forum post created successfully",
            data: {
                post: newForum
            },
            timestamp: new Date()
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating forum post",
            error: error.message,
            timestamp: new Date()
        });
    }
});

// Get specific forum post by ID
app.get("/api/forum/:id", async (req, res) => {
    try {
        const post = await Forum.findById(req.params.id)
            .populate('author', 'username email');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Forum post not found"
            });
        }

        res.json({
            success: true,
            message: "Forum post retrieved successfully",
            data: {
                post: post
            },
            timestamp: new Date()
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving forum post",
            error: error.message,
            timestamp: new Date()
        });
    }
});

// Current Routes (EJS - will keep during transition) - AFTER API ROUTES
app.use("/annadata", annadataRouter);
app.use("/annadata/:id", forumRouter);

// User routes come last since they have "/" catch-all
app.use("/", userRouter);

// Error handling middleware
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// Start the server
app.listen(5050,()=>{
    console.log("Server is running on port 5050")
});
