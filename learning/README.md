# Annadata Backend Architecture

This documentation explains the architecture, implementation decisions, and alternatives for the Annadata backend system. Annadata is a platform designed to support farmers with access to agricultural schemes, community forums, crop management, and weather information.

## Table of Contents

1. [Overall Architecture](./01-Architecture.md)
2. [Database Design](./02-Database.md)
3. [API Design](./03-API-Design.md)
4. [Authentication & Authorization](./04-Authentication.md)
5. [Controllers & Business Logic](./05-Controllers.md)
6. [Middleware](./06-Middleware.md)
7. [Error Handling](./07-Error-Handling.md)
8. [Weather Integration](./08-Weather-Integration.md)
9. [Crop Management](./09-Crop-Management.md)
10. [Alternatives & Trade-offs](./10-Alternatives.md)

## System Overview

Annadata's backend is built using a Node.js and Express framework with MongoDB as the database. The system follows the MVC (Model-View-Controller) pattern for organizing code and responsibilities.

Key components:
- **Express Server**: Handles HTTP requests and routing
- **MongoDB/Mongoose**: Data storage and modeling
- **JWT Authentication**: Secure user authentication
- **RESTful API Design**: Standardized API endpoints
- **Weather API Integration**: External data source integration
- **Error Handling Middleware**: Centralized error management
- **Async Handler Utility**: Simplified async/await error handling

## Tech Stack

- **Node.js**: JavaScript runtime for server-side execution
- **Express**: Web framework for building the API
- **MongoDB**: NoSQL database
- **Mongoose**: ODM (Object Data Modeling) for MongoDB
- **JSON Web Tokens**: Secure authentication mechanism
- **bcrypt**: Password hashing
- **Axios**: HTTP client for external API requests

## Getting Started

For new developers looking to understand the system, start with the Architecture document and then follow the numbered sequence to build a comprehensive understanding of the system.
