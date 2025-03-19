# Database Design

## Database Choice: MongoDB

For Annadata, we chose MongoDB as our database system for several reasons:

1. **Schema Flexibility**: As a NoSQL database, MongoDB allows for flexible schema design that can evolve with the application's needs. This is particularly important for Annadata, where different types of agricultural data may require different structures.

2. **Document-Oriented Structure**: The document model maps naturally to JavaScript objects, making development more intuitive and reducing object-relational impedance mismatch.

3. **Scalability**: MongoDB's horizontal scaling capabilities through sharding provide a path for growth as the application scales.

4. **JSON/BSON Format**: Native support for JSON-like documents aligns well with our REST API that sends and receives JSON.

5. **Geospatial Capabilities**: MongoDB's support for geospatial queries is valuable for location-based features like finding schemes or weather data based on a farmer's location.

## Database Connection

In `server.js`, we establish a connection to MongoDB using Mongoose:

```javascript
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://...')
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
```

We use MongoDB Atlas as our cloud database provider because it offers:
- Managed database service with automated backups
- Easy scaling options
- Built-in monitoring and alerting
- Security features like IP whitelisting and VPC peering

## Data Models

### User Model

```javascript
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
  // ...other fields
  isAdmin: {
    type: Boolean,
    default: false
  }
});
```

The User model includes authentication credentials, profile information, and role-based permissions (admin status). Password hashing is handled through a pre-save hook using bcrypt.

### Forum Model

```javascript
const forumSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  // ...other fields
  answers: [answerSchema]
});
```

The Forum model represents questions in the community forum. It uses a subdocument structure for answers, which is a good fit for MongoDB as it allows efficient retrieval of a question with all its answers in a single query.

### Scheme Model

```javascript
const schemeSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  // ...other fields
});
```

The Scheme model represents government or institutional agricultural schemes available to farmers.

### Crop Model

```javascript
const cropSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // ...other fields
  expenses: [{
    item: String,
    cost: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }]
});
```

The Crop model enables farmers to track their crops and related expenses.

## Data Relationships

We use a combination of embedding and referencing strategies:

1. **References**: Used for one-to-many relationships where the "many" side could be large or needs to be queried independently:
   - User to Crops relationship (one user can have many crops)
   - User to Forum Questions relationship

2. **Embedding**: Used for relationships where the related data is always accessed together and is limited in size:
   - Forum Questions to Answers relationship
   - Crop to Expenses relationship

## Alternatives Considered

### SQL Databases (PostgreSQL, MySQL)

- **Pros**: ACID compliance, better for complex joins and transactions
- **Cons**: Fixed schema is less flexible, requires migrations for changes
- **Why Not Chosen**: Our data has varying structures, and we prioritized development speed and flexibility over rigid schema enforcement.

### Graph Databases (Neo4j)

- **Pros**: Excellent for complex relationships and network analysis
- **Cons**: Steeper learning curve, less mainstream support
- **Why Not Chosen**: While we have relationships between entities, they are not complex enough to warrant a specialized graph database.

### Firebase/Firestore

- **Pros**: Real-time capabilities, managed service, good for mobile apps
- **Cons**: Query limitations, pricing can scale quickly with usage
- **Why Not Chosen**: We wanted more control over our database structure and queries, and MongoDB provided a better balance of flexibility and control.

## Best Practices

1. **Indexes**: Created on frequently queried fields like username, email, and tags to improve query performance
2. **Data Validation**: Schema-level validation enforces data integrity
3. **Password Security**: Passwords are never stored in plain text, always hashed with bcrypt
4. **Environment Variables**: Database connection strings are stored in environment variables, not hard-coded
5. **References**: Using references for relationships that may need to be queried independently
6. **Denormalization**: Strategic data denormalization for performance optimization where appropriate
