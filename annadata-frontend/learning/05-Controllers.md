# Controllers & Business Logic

## Controller Design Philosophy

In Annadata's architecture, controllers are responsible for:

1. **Handling HTTP Requests**: Processing incoming requests from routes
2. **Business Logic**: Implementing application-specific logic
3. **Data Validation**: Ensuring input data meets requirements
4. **Database Operations**: Interacting with models to perform CRUD operations
5. **Response Formatting**: Structuring data for client consumption

Our controllers follow these design principles:

1. **Single Responsibility**: Each controller method handles one specific action
2. **Thin Controllers**: Complex business logic can be moved to service layers if needed
3. **Asynchronous Operations**: Using async/await for cleaner asynchronous code
4. **Error Handling**: Using try/catch with the asyncHandler utility
5. **Clear Naming**: Method names that clearly indicate their purpose

## Controller Implementation

Controllers are organized by resource domain, with each controller handling related operations:

### User Controller

The User controller manages user profile-related operations:

```javascript
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
```

### Forum Controller

The Forum controller manages community questions and answers:

```javascript
const getQuestionById = asyncHandler(async (req, res) => {
  const question = await Forum.findById(req.params.id)
    .populate('author', 'username avatar')
    .populate('answers.author', 'username avatar');
  
  if (question) {
    res.json(question);
  } else {
    res.status(404);
    throw new Error('Question not found');
  }
});
```

### Scheme Controller

The Scheme controller manages agricultural scheme information:

```javascript
const getSchemes = asyncHandler(async (req, res) => {
  const schemes = await Scheme.find({}).sort({ createdAt: -1 });
  res.json({ schemes });
});
```

### Crop Controller

The Crop controller manages farmer's crop information:

```javascript
const createCrop = asyncHandler(async (req, res) => {
  const { name, cropType, area, plantingDate } = req.body;
  
  if (!name || !cropType || !area || !plantingDate) {
    res.status(400);
    throw new Error('Required fields missing');
  }
  
  const crop = await Crop.create({
    name,
    user: req.user._id,
    cropType,
    area,
    plantingDate
    // ...other fields
  });
  
  res.status(201).json(crop);
});
```

### Weather Controller

The Weather controller integrates with external weather APIs:

```javascript
const getWeatherForecast = asyncHandler(async (req, res) => {
  const { lat, lon, location } = req.query;
  
  // Input validation
  if ((!lat || !lon) && !location) {
    res.status(400);
    throw new Error('Location parameters required');
  }
  
  // API request and response formatting
  // ...
});
```

## Async Handler Utility

We use an `asyncHandler` utility to reduce boilerplate error handling code:

```javascript
// From utils/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

This utility wraps controller functions, allowing them to use async/await while still properly handling errors and passing them to Express's error middleware.

## Data Population Strategies

For endpoints that need related data, we use Mongoose's population feature to efficiently retrieve related documents:

```javascript
const questions = await Forum.find({})
  .populate('author', 'username avatar')  // Only select needed fields
  .sort({ createdAt: -1 });
```

## Alternatives Considered

### Service Layer Pattern

- **Pros**: Better separation of concerns, more testable business logic
- **Cons**: Additional abstraction layer, more files to manage
- **Why Not Chosen**: For our current application size, the additional complexity wasn't warranted. As the application grows, introducing a service layer could be beneficial.

### Fat Models

- **Pros**: Business logic encapsulated in models, reusable across controllers
- **Cons**: Can lead to large, complex models
- **Why Not Chosen**: We preferred keeping models focused on data structure and validation, with business logic in controllers.

### GraphQL Resolvers

- **Pros**: Better type safety, more flexible data fetching
- **Cons**: Different paradigm, steeper learning curve
- **Why Not Chosen**: REST controllers were more straightforward for our use case and team expertise.

## Best Practices Implemented

1. **Input Validation**: Always validate input before processing
2. **Clear Error Messages**: Provide helpful error messages
3. **Consistent Response Format**: Follow consistent patterns for success/error responses
4. **Status Codes**: Use appropriate HTTP status codes for different situations
5. **Selective Population**: Only populate necessary fields in related documents
6. **Pagination**: Implement pagination for list endpoints that could return many items
7. **Sorting & Filtering**: Provide sorting and filtering options where appropriate
