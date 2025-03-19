# Authentication & Authorization

## Authentication Strategy

Annadata implements token-based authentication using JSON Web Tokens (JWT). This approach was chosen for several key reasons:

1. **Stateless**: No need to store session information on the server, improving scalability
2. **Mobile-Friendly**: Works well for mobile clients as well as web applications
3. **Cross-Domain**: Easily used across different domains and services
4. **Expiration**: Built-in expiration mechanism
5. **Security**: Can contain encrypted information about the user

## JWT Implementation

### Token Generation

When a user registers or logs in, a JWT is generated using the user's ID and username:

```javascript
// From User.js model
userSchema.methods.generateToken = function() {
  return jwt.sign(
    { id: this._id, username: this.username }, 
    process.env.JWT_SECRET || 'mysupersecretjwtkey',
    { expiresIn: '7d' }
  );
};
```

Key aspects of our JWT implementation:

1. **Secret Key**: Stored in environment variables for security
2. **Expiration**: Tokens expire after 7 days, requiring re-authentication
3. **Payload**: Contains minimal information (user ID and username)
4. **Error Handling**: Proper error handling for token verification failures

### Authentication Middleware

The `protect` middleware validates JWTs and attaches the user to the request object:

```javascript
// From authMiddleware.js
const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysupersecretjwtkey');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
```

This middleware:
- Extracts the token from the Authorization header
- Verifies the token's signature and expiration
- Retrieves the user from the database (excluding the password)
- Attaches the user object to the request for use in route handlers
- Returns appropriate errors if authentication fails

## Authorization

Beyond authentication (verifying identity), we implement authorization (verifying permissions) through role-based access control:

### Admin Middleware

The `isAdmin` middleware checks if an authenticated user has admin privileges:

```javascript
// From adminMiddleware.js
const isAdmin = async (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ 
      message: 'Access denied: Admin privileges required'
    });
  }
  next();
};
```

This middleware is used to protect routes that should only be accessible to administrators, such as creating or updating agricultural schemes.

### Resource Ownership Checks

For user-specific resources like crops, we implement ownership checks in controllers:

```javascript
// Example from cropController.js
const updateCrop = asyncHandler(async (req, res) => {
  const crop = await Crop.findById(req.params.id);
  
  if (!crop) {
    res.status(404);
    throw new Error('Crop not found');
  }
  
  if (crop.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this crop');
  }
  
  // Proceed with update if authorized
  // ...
});
```

This ensures users can only modify their own resources.

## Password Security

### Password Hashing

User passwords are never stored in plain text. We use bcrypt to hash passwords:

```javascript
// From User.js model
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
```

This pre-save hook automatically hashes passwords when they're created or modified.

### Password Validation

For login, passwords are compared using bcrypt's compare function:

```javascript
// From User.js model
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

## Alternatives Considered

### Session-Based Authentication

- **Pros**: More traditional, easier server-side control, easier to invalidate
- **Cons**: Requires session storage, less scalable, more complex with mobile clients
- **Why Not Chosen**: JWT offers better scalability and is more suitable for modern web/mobile applications.

### OAuth/Social Login

- **Pros**: Eliminates password management, familiar to users, potentially better security
- **Cons**: Dependency on third-party services, more complex implementation
- **Why Not Chosen**: We wanted full control over the authentication process for this phase, but could add social login options in the future.

### API Keys

- **Pros**: Simple to implement, good for service-to-service communication
- **Cons**: Less secure for user authentication, harder to manage permissions
- **Why Not Chosen**: Not suitable for user-based authentication in web applications.

## Security Best Practices

1. **HTTPS**: All production traffic should use HTTPS
2. **Environment Variables**: JWT secret stored in environment variables
3. **Token Expiration**: JWTs expire after a reasonable period
4. **Error Messages**: Generic error messages that don't leak information
5. **Rate Limiting**: Consider implementing for login attempts to prevent brute force attacks
6. **CORS Configuration**: Properly configured to prevent unauthorized cross-origin requests
7. **Input Validation**: Validate all user input before processing
8. **HTTP-Only Cookies**: Consider storing tokens in HTTP-only cookies for additional security
