# Error Handling

## Error Handling Philosophy

Effective error handling is crucial for building a robust application. In Annadata, we follow these principles:

1. **Centralized Error Handling**: Catching and formatting errors consistently
2. **User-Friendly Messages**: Providing clear error messages to clients
3. **Developer Information**: Including detailed error information in development
4. **Appropriate Status Codes**: Using correct HTTP status codes for different error types
5. **Graceful Degradation**: Ensuring the application continues to function despite errors

## Error Handling Implementation

### AsyncHandler Utility

One of the key components of our error handling strategy is the `asyncHandler` utility:

```javascript
// From utils/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

This utility wraps controller functions, allowing them to use async/await while still properly handling errors and passing them to Express's error middleware.

### Error Middleware

Our error handling middleware catches and formats errors:

```javascript
// From middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
```

These middleware functions:
1. Handle 404 errors for non-existent routes
2. Catch and format other errors with appropriate status codes
3. Provide stack traces in development but not in production

### Error Throwing in Controllers

In controllers, we throw errors with appropriate status codes:

```javascript
// Example from controller
if (!user) {
  res.status(404);
  throw new Error('User not found');
}

if (!isValidData) {
  res.status(400);
  throw new Error('Invalid input data');
}
```

This approach:
1. Sets the appropriate HTTP status code
2. Throws an error with a clear message
3. Relies on the error middleware to catch and format the error

### Error Handling for External API Calls

For external API calls (like weather data), we implement specific error handling:

```javascript
try {
  const response = await axios.get(apiUrl);
  // Process response
} catch (error) {
  console.error('API Error:', error.response?.data || error.message);
  res.status(error.response?.status || 500);
  throw new Error(error.response?.data?.message || 'Error fetching data');
}
```

This handles:
1. Connection errors
2. API-specific error responses
3. Unexpected errors

## Error Types

We handle various types of errors:

### Validation Errors

```javascript
if (!title || !content) {
  res.status(400);
  throw new Error('Title and content are required');
}
```

### Authentication Errors

```javascript
if (!token) {
  res.status(401);
  throw new Error('Not authorized, no token');
}
```

### Authorization Errors

```javascript
if (crop.user.toString() !== req.user._id.toString()) {
  res.status(403);
  throw new Error('Not authorized to update this crop');
}
```

### Not Found Errors

```javascript
if (!scheme) {
  res.status(404);
  throw new Error('Scheme not found');
}
```

### Database Errors

These are caught by the asyncHandler and passed to the error middleware.

## Logging

For production environments, we implement error logging:

```javascript
// Error logging in production
if (process.env.NODE_ENV === 'production') {
  console.error('Error:', err.message);
  // Could integrate with a logging service like Winston, Sentry, etc.
}
```

## Alternatives Considered

### Try-Catch in Every Controller

- **Pros**: More explicit error handling at each point
- **Cons**: Repetitive code, inconsistent error handling
- **Why Not Chosen**: The asyncHandler utility provides a more elegant, consistent solution

### Custom Error Classes

- **Pros**: More type-specific error handling, better error classification
- **Cons**: More complex, requires more code
- **Why Not Chosen**: Simple error throwing with status codes was sufficient for our needs, but could be implemented in the future as the application grows

### Third-Party Error Handling Libraries

- **Pros**: More features, possibly better handling of specific cases
- **Cons**: Additional dependency, possibly overkill
- **Why Not Chosen**: Express's built-in error handling, combined with our middleware, was sufficient

## Best Practices

1. **Consistent Error Format**: All errors follow the same response format
2. **Appropriate Status Codes**: Using correct HTTP status codes (400, 401, 403, 404, 500)
3. **Clear Error Messages**: Providing helpful, user-friendly error messages
4. **Environment-Specific Behavior**: Different error details in development vs. production
5. **Centralized Handling**: Using middleware for consistent error processing
6. **Async Error Handling**: Using asyncHandler utility to catch async errors
7. **Input Validation**: Validating input early to prevent downstream errors
8. **Graceful Error Recovery**: Ensuring the application continues to function despite errors
