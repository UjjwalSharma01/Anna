# API Design

## RESTful API Architecture

Annadata's backend implements a RESTful API design pattern. REST (Representational State Transfer) is an architectural style that defines a set of constraints for creating web services. We chose REST for several reasons:

1. **Stateless**: Each request contains all information needed to process it, simplifying server implementation.
2. **Resource-Based**: APIs are organized around resources (users, schemes, crops), making the API intuitive.
3. **Standard HTTP Methods**: Using GET, POST, PUT, DELETE for CRUD operations is widely understood.
4. **Scalability**: Stateless design enables better caching and load balancing.

## API Routes Structure

Our routes are organized by resource domain:

```
/api/auth     - Authentication (register, login)
/api/users    - User profile management
/api/forum    - Community forum questions and answers
/api/schemes  - Agricultural scheme information
/api/crops    - Farmer's crop management
/api/weather  - Weather forecasts and agricultural advice
/api/home     - Homepage content aggregation
```

## Route Implementation

Routes are defined in separate files under the `routes/` directory:

```javascript
// Example from schemeRoutes.js
const router = express.Router();

// Public routes
router.get('/', getSchemes);
router.get('/:id', getSchemeById);

// Protected routes
router.post('/:id/apply', protect, applyForScheme);

// Admin routes
router.post('/', protect, isAdmin, createScheme);
router.put('/:id', protect, isAdmin, updateScheme);
router.delete('/:id', protect, isAdmin, deleteScheme);
```

Key features of our route implementation:

1. **Modular Design**: Each resource type has its own router module
2. **Middleware Chaining**: Routes use middleware for authentication and permission checks
3. **Descriptive Naming**: Route handler functions have clear, descriptive names
4. **HTTP Method Semantics**: Proper use of HTTP methods for their intended purposes

## Access Control Patterns

Our API routes implement three levels of access control:

1. **Public Routes**: Accessible without authentication (e.g., viewing schemes, forum posts)
2. **Protected Routes**: Require user authentication (e.g., creating forum posts, managing crops)
3. **Admin Routes**: Require admin privileges (e.g., creating/updating schemes)

This is implemented through middleware:

```javascript
// Public endpoint - no middleware
router.get('/', getSchemes);

// Protected endpoint - requires authentication
router.post('/crops', protect, createCrop);

// Admin endpoint - requires authentication and admin role
router.post('/schemes', protect, isAdmin, createScheme);
```

## URL Pattern Conventions

We follow these URL patterns for consistency:

1. **Collection Resources**: Plural nouns (e.g., `/api/schemes`, `/api/crops`)
2. **Singular Resources**: Collection followed by ID (e.g., `/api/schemes/:id`)
3. **Sub-Resources**: Nested under parent (e.g., `/api/forum/questions/:id/answers`)
4. **Actions**: Use HTTP methods for standard operations, POST with verb for non-standard operations (e.g., `/api/schemes/:id/apply`)

## Request and Response Format

All API endpoints accept and return JSON data:

```javascript
// Example response format
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Example Crop",
    "createdAt": "2023-06-15T10:30:00Z"
  },
  "message": "Crop created successfully"
}
```

For error responses:

```javascript
{
  "message": "Resource not found",
  "stack": "Error stack trace (development only)"
}
```

## Pagination, Filtering and Searching

For endpoints that return collections, we implement pagination:

```javascript
// Example from forumController.js
const getQuestions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  
  const count = await Forum.countDocuments();
  
  const questions = await Forum.find({})
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize);
  
  res.json({
    questions,
    page,
    totalPages: Math.ceil(count / pageSize)
  });
});
```

Search functionality is implemented for forum questions:

```javascript
// From forumController.js
const searchQuestions = asyncHandler(async (req, res) => {
  const query = req.query.q;
  
  const questions = await Forum.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  })
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 });
  
  res.json(questions);
});
```

## Alternatives Considered

### GraphQL

- **Pros**: Client can request exactly the data they need, reduces over-fetching
- **Cons**: More complex to set up, steeper learning curve
- **Why Not Chosen**: REST was sufficient for our current needs and more familiar to the team. The additional complexity of GraphQL wasn't justified for our use cases.

### RPC-style APIs

- **Pros**: More focused on actions rather than resources, can be more intuitive for certain operations
- **Cons**: Less standardized, more difficult to scale
- **Why Not Chosen**: REST's resource-oriented approach aligns better with our domain model and provides better discoverability.

### Custom API Format

- **Pros**: Could be tailored exactly to our needs
- **Cons**: Non-standard, harder for new developers to understand
- **Why Not Chosen**: Following REST conventions provides clarity and consistency, leveraging existing knowledge and tools.

## Best Practices

1. **Versioning**: API endpoints can be versioned (e.g., `/api/v1/...`) when needed
2. **Consistent Error Handling**: Standardized error responses across all endpoints
3. **Input Validation**: Validate request data before processing
4. **Appropriate Status Codes**: Using correct HTTP status codes (200, 201, 400, 401, 403, 404, 500)
5. **Documentation**: Routes are documented with comments describing purpose, access level, and route path
6. **Rate Limiting**: Could be implemented to prevent abuse (not currently implemented but recommended)
7. **CORS Configuration**: Properly configured for security
