# Resume-Forge Backend

A robust Node.js + Express REST API for the Resume-Forge application, providing comprehensive resume building and management functionality with secure JWT authentication and MySQL database persistence.

**Status:** ✅ All 33 API endpoints tested and validated (0 errors)

## Tech Stack

- **Runtime:** Node.js 24.x
- **Framework:** Express.js 5.x
- **Database:** MySQL 8.x with mysql2 driver
- **Authentication:** JWT (jsonwebtoken 9.x) + bcryptjs
- **Utilities:** CORS, dotenv for environment configuration

## Features

### User Management
- User registration with email validation
- Secure login with JWT token generation
- Password hashing with bcryptjs
- User profile retrieval and management

### Resume/Document Management
- Create, read, update, delete resume documents
- User-specific resume access control
- Resume templates support
- Document versioning and snapshots

### Resume Content Structure
- Sections (e.g., Experience, Education, Skills)
- Items within sections with rich JSON content
- Position ordering within sections
- Hierarchical resume structure

### Advanced Features
- Resume versioning with snapshots
- Share links with unique slugs for public access
- Export functionality (PDF, DOCX formats)
- Job application tracking and status management
- Template configuration and management
- Comprehensive analytics

## Project Structure

```
Backend/
├── config/
│   └── config.js                 # Database configuration
├── controllers/                  # Business logic (alternative layer)
├── middleware/
│   ├── authMiddleware.js         # JWT verification
│   └── validateMiddleware.js     # Input validation
├── models/                       # Data access layer (alternative pattern)
├── migrations/                   # SQL schema definitions
├── routes/
│   ├── userRoutes.js            # User endpoints
│   ├── resumeRoutes.js          # Resume CRUD
│   ├── sectionRoutes.js         # Section management
│   ├── itemRoutes.js            # Item content
│   ├── templateRoutes.js        # Template management
│   ├── versionRoutes.js         # Version snapshots
│   ├── shareRoutes.js           # Share links
│   ├── exportRoutes.js          # Export records
│   └── applicationRoutes.js     # Job applications
├── api-check.js                 # Comprehensive API validation suite
├── db.js                        # MySQL connection pool
├── server.js                    # Express app initialization
├── package.json                 # Dependencies and scripts
├── .env                         # Environment variables
└── README.md                    # This file
```

## Setup & Installation

### Prerequisites
- Node.js 24.x or higher
- MySQL 8.x or higher
- npm or yarn

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=resume_forge

# JWT Configuration
JWT_SECRET=resume_forge_super_secret_2026
```

### Step 3: Initialize Database

Execute the migration files in order to create the database schema:

```bash
mysql -u root -p resume_forge < migrations/20260101000001_create_users_table.sql
mysql -u root -p resume_forge < migrations/20260101000002_create_templates_table.sql
mysql -u root -p resume_forge < migrations/20260101000003_create_resumes_table.sql
mysql -u root -p resume_forge < migrations/20260101000004_create_sections_table.sql
mysql -u root -p resume_forge < migrations/20260101000005_create_items_table.sql
mysql -u root -p resume_forge < migrations/20260101000006_create_versions_table.sql
mysql -u root -p resume_forge < migrations/20260101000007_create_shares_table.sql
mysql -u root -p resume_forge < migrations/20260101000008_create_exports_table.sql
mysql -u root -p resume_forge < migrations/20260101000009_create_applications_and_analytics_table.sql
```

### Step 4: Start the Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server runs on `http://localhost:5000` by default.

## API Endpoints

### Authentication & Users
- `POST /api/users` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user (auth required)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

### Resume/Documents
- `POST /api/resumes` - Create resume (auth required)
- `GET /api/resumes` - Get user's resumes (auth required)
- `GET /api/resumes/:id` - Get resume by ID (auth required)
- `PUT /api/resumes/:id` - Update resume (auth required)
- `DELETE /api/resumes/:id` - Delete resume (auth required)

### Sections
- `POST /api/sections/resume/:resumeId` - Create section
- `GET /api/sections/resume/:resumeId` - Get sections for resume
- `GET /api/sections/:id` - Get section by ID
- `PUT /api/sections/:id` - Update section
- `DELETE /api/sections/:id` - Delete section

### Items
- `POST /api/items/section/:sectionId` - Create item
- `GET /api/items/section/:sectionId` - Get items in section
- `GET /api/items/:id` - Get item by ID
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Templates
- `POST /api/templates` - Create template (auth required)
- `GET /api/templates` - Get all templates (auth required)
- `GET /api/templates/:id` - Get template by ID (auth required)
- `PUT /api/templates/:id` - Update template (auth required)
- `DELETE /api/templates/:id` - Delete template (auth required)

### Versions
- `POST /api/versions` - Create version snapshot (auth required)
- `GET /api/versions` - Get all versions (auth required)
- `GET /api/versions/document/:documentId` - Get versions for document
- `GET /api/versions/:id` - Get version by ID (auth required)
- `PUT /api/versions/:id` - Update version (auth required)
- `DELETE /api/versions/:id` - Delete version (auth required)

### Shares
- `POST /api/shares/document/:documentId` - Create share link (auth required)
- `GET /api/shares/:slug` - Get shared resume by slug
- `GET /api/shares` - Get all shares
- `DELETE /api/shares/:id` - Delete share (auth required)

### Exports
- `POST /api/exports` - Create export record (auth required)
- `GET /api/exports` - Get user's exports (auth required)
- `GET /api/exports/:id` - Get export by ID (auth required)
- `GET /api/exports/document/:documentId` - Get exports for document
- `DELETE /api/exports/:id` - Delete export (auth required)

### Applications
- `POST /api/applications` - Create job application (auth required)
- `GET /api/applications` - Get all applications
- `GET /api/applications/user/:userId` - Get applications for user
- `GET /api/applications/:id` - Get application by ID
- `PUT /api/applications/:id` - Update application (auth required)
- `DELETE /api/applications/:id` - Delete application (auth required)

### Utilities
- `GET /api/test-db` - Test database connection health

## API Validation

Run the comprehensive API validation suite:

```bash
npm test
```

This executes `api-check.js`, which tests all 33 endpoints with:
- User registration and authentication
- CRUD operations for all resource types
- JSON serialization round-tripping
- Foreign key cascade relationships
- Response format validation

**Expected Output:** `ALL_API_CHECKS_PASSED` with exit code 0

## Database Schema Overview

### Users Table
- Stores user credentials and account tier information
- Supports JWT-based authentication

### Documents (Resumes) Table
- Tracks user resumes with optional template associations
- Foreign key to users with cascade delete

### Sections Table
- Organizes resume content into logical sections
- Position-based ordering within documents

### Items Table
- Leaf-level resume content with JSON payloads
- Supports rich content with nested objects

### Templates Table
- Pre-configured resume layouts and styling
- JSON configuration with theme and accent settings

### Versions Table
- Snapshots of resume states for version control
- JSON snapshot storage with labels

### Shares Table
- Public sharing links with unique slugs
- Enables viewing resumes without authentication

### Exports Table
- Tracks export requests (PDF, DOCX)
- File URL storage and format tracking

### Applications Table
- Job application pipeline tracking
- Status management (saved, applied, interview, offer, rejected)

## Authentication

The API uses Bearer token JWT authentication. Include the token in request headers:

```bash
Authorization: Bearer <your_jwt_token>
```

Tokens are generated upon successful login and expire in 7 days.

## Error Handling

All endpoints return consistent JSON responses:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request (validation failed)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Internal Server Error

## Key Implementation Details

### JSON Serialization
- Complex objects (config, content, snapshot) are automatically serialized to strings on database insert
- Automatically parsed back to objects on retrieval via helper functions

### Foreign Key Cascades
- Deleting a user deletes their resumes
- Deleting a resume deletes associated sections and items
- Deleting a section deletes associated items

### Authentication Middleware
- Validates JWT tokens from `Authorization` header
- Attaches decoded user info to `req.user`
- Returns 401 for missing/invalid tokens

## Troubleshooting

### Database Connection Failed
- Verify MySQL is running
- Check credentials in `.env` file
- Ensure database `resume_forge` exists

### JWT Token Errors
- Ensure `JWT_SECRET` matches between server and client
- Check token hasn't expired (7-day expiration)
- Verify token is included with `Bearer` prefix

### 404 on Endpoints
- Verify server is running on port 5000
- Check request path matches route definitions
- Ensure auth token is provided for protected routes

## Development

### Run with Auto-Reload
```bash
npm run dev
```

Uses Node's `--watch` flag to auto-restart on file changes.

### Database Testing
```bash
npm run test
```

Runs `api-check.js` for comprehensive endpoint validation.

## Contributing

1. Make changes to route files in `routes/`
2. Update database schema in `migrations/` if needed
3. Run `npm test` to validate changes
4. Commit and push to main branch

## License

Proprietary - Resume-Forge Project

## Support

For issues or questions, contact the development team.
PORT=5000

Start the server:

node server.js

Server:

http://localhost:5000

## API Routes

### Users

POST   /api/users
POST   /api/users/login
GET    /api/users/me
GET    /api/users
GET    /api/users/:id

### Resumes

POST   /api/resumes
GET    /api/resumes
GET    /api/resumes/:id
PUT    /api/resumes/:id
DELETE /api/resumes/:id

## Database

Database: resume_forge

Main tables:

users
documents
sections
items
templates
shares
exports
applications
versions

## Security

- Passwords are hashed using bcryptjs.
- Authentication uses JWT.
- Protected resume routes verify user ownership.
- Sensitive environment variables are excluded from Git using .gitignore.

## Status

Backend completed and ready for frontend integration.
