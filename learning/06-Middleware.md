# Middleware Components

## Middleware Architecture

Middleware functions in Express are functions that have access to the request object (`req`), response object (`res`), and the next middleware function in the application's request-response cycle. Middleware can:

1. Execute any code
2. Make changes to the request and response objects
3. End the request-response cycle
4. Call the next middleware in the stack

In Annadata, middleware plays several crucial roles:

1. **Authentication & Authorization**: Protecting routes and validating user access
2. **Error Handling**: Catching and formatting errors
3. **Request Processing**: Parsing JSON bodies, handling CORS, etc.

## Built-in Middleware

Annadata uses several built-in Express middleware functions:

```javascript
// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://annadata-production-frontend.com' 
    : ['http://localhost:3000', 'https://github.dev'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static file serving
app.use('/static', express.static(path.join(__dirname, '../public')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));
```

## Custom Authentication Middleware

### Protect Middleware

The `protect` middleware authenticates users through JWT tokens:

```javascript
const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
```

This middleware:
1. Extracts the JWT token from the Authorization header
2. Verifies the token's authenticity
3. Retrieves the user from the database
4. Attaches the user object to the request for use in subsequent handlers

### Admin Middleware

The `isAdmin` middleware checks if an authenticated user has admin privileges:

```javascript
const isAdmin = async (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ 
      message: 'Access denied: Admin privileges required'
    });
  }
  next();
};
```

This middleware is used after the `protect` middleware to restrict access to admin-only routes.

## Error Handling Middleware

### Not Found Handler

The `notFound` middleware handles requests to non-existent routes:

```javascript
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
```

### Error Handler

The `errorHandler` middleware formats error responses:

```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
```

This middleware:
1. Sets the appropriate status code
2. Returns a JSON response with the error message
3. Includes the stack trace in development but not in production

## Middleware Ordering

The order of middleware registration is important:

1. Request processing middleware (body parsing, CORS)
2. Custom application middleware (authentication, etc.)
3. Routes
4. Error handling middleware

```javascript
// Request processing middleware
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use('/api/auth', authRoutes);
// ...other routes

// Error handling middleware (last)
app.use(notFound);
app.use(errorHandler);
```

## Middleware Design Patterns

### Chaining Middleware

We chain middleware for routes that need multiple processing steps:

```javascript
// Route with multiple middleware functions
router.post('/schemes', protect, isAdmin, createScheme);
```

### Router-Level Middleware

For routes that all require authentication, we apply middleware at the router level:

```javascript
// All routes in this router require authentication
router.use(protect);

router.get('/', getUserCrops);
router.post('/', createCrop);
// ...other routes
```

## Alternatives Considered

### Custom Middleware Framework

- **Pros**: More tailored to application needs
- **Cons**: Reinventing the wheel, more maintenance
- **Why Not Chosen**: Express middleware system is mature and meets our needs

### JWT in Cookies Instead of Headers

- **Pros**: More secure against XSS, easier to handle in web applications
- **Cons**: More complex to use with mobile applications, CSRF concerns
- **Why Not Chosen**: Header-based authentication provides more flexibility across different client types

### Separate Authentication Service

- **Pros**: More scalable, could be shared across multiple services
- **Cons**: Added complexity, network overhead
- **Why Not Chosen**: Monolithic approach was simpler for our current scale

## Best Practices

1. **Focused Middleware**: Each middleware function does one thing and does it well
2. **Error Handling**: Proper error handling in middleware
3. **Next Function**: Always call next() or send a response to avoid hanging requests
4. **Middleware Order**: Careful attention to the order of middleware registration
5. **Environment Awareness**: Different behavior in development vs. production
6. **Security Considerations**: Implementing security best practices in middleware
7. **Reusability**: Creating reusable middleware functions
