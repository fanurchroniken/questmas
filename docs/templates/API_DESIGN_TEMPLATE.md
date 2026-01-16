# API Design Documentation

## API Overview

### Base URL
```
Development: http://localhost:3000/api
Production: https://api.yourdomain.com
```

### Authentication
[Describe authentication method - JWT, OAuth, etc.]

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

## API Endpoints

### Authentication Endpoints

#### POST /auth/register
Register a new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token"
}
```

#### POST /auth/login
Login user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": { ... },
  "token": "jwt_token"
}
```

#### POST /auth/logout
Logout user

#### POST /auth/refresh
Refresh authentication token

### Project Endpoints

#### GET /projects
Get all projects for authenticated user

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `sort`: Sort field (default: updated_at)
- `order`: asc/desc (default: desc)

**Response:**
```json
{
  "projects": [
    {
      "id": "uuid",
      "title": "My Novel",
      "description": "...",
      "wordCount": 50000,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

#### POST /projects
Create a new project

**Request:**
```json
{
  "title": "My Novel",
  "description": "A great story"
}
```

#### GET /projects/:id
Get project by ID

#### PUT /projects/:id
Update project

#### DELETE /projects/:id
Delete project

### Chapter Endpoints

#### GET /projects/:projectId/chapters
Get all chapters for a project

**Query Parameters:**
- `sort`: Sort by order or date

#### POST /projects/:projectId/chapters
Create a new chapter

**Request:**
```json
{
  "title": "Chapter 1",
  "content": "Chapter content...",
  "orderIndex": 1
}
```

#### GET /chapters/:id
Get chapter by ID

#### PUT /chapters/:id
Update chapter

**Request:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "tags": ["tag1", "tag2"]
}
```

#### DELETE /chapters/:id
Delete chapter

#### POST /chapters/:id/spell-check
Run spell check on chapter

**Response:**
```json
{
  "errors": [
    {
      "word": "teh",
      "suggestions": ["the"],
      "position": 123,
      "line": 5
    }
  ]
}
```

### Tag Endpoints

#### GET /tags
Get all tags for user

#### POST /tags
Create a new tag

**Request:**
```json
{
  "name": "Important",
  "color": "#FF0000"
}
```

#### PUT /tags/:id
Update tag

#### DELETE /tags/:id
Delete tag

### Worldbuilding Endpoints

#### Characters

##### GET /worldbuilding/characters
Get all characters

**Query Parameters:**
- `projectId`: Filter by project
- `search`: Search by name
- `page`, `limit`: Pagination

##### POST /worldbuilding/characters
Create a character

**Request:**
```json
{
  "name": "John Doe",
  "age": 30,
  "description": "...",
  "projectId": "uuid",
  "customFields": {
    "magicPower": "Fire",
    "alignment": "Good"
  }
}
```

##### GET /worldbuilding/characters/:id
Get character by ID

##### PUT /worldbuilding/characters/:id
Update character

##### DELETE /worldbuilding/characters/:id
Delete character

#### Timelines

##### GET /worldbuilding/timelines
Get all timelines

##### POST /worldbuilding/timelines
Create a timeline

**Request:**
```json
{
  "name": "Main Timeline",
  "projectId": "uuid",
  "events": [
    {
      "title": "Event 1",
      "date": "Year 1000",
      "description": "..."
    }
  ]
}
```

##### GET /worldbuilding/timelines/:id
Get timeline with events

##### PUT /worldbuilding/timelines/:id
Update timeline

##### POST /worldbuilding/timelines/:id/events
Add event to timeline

##### PUT /worldbuilding/timelines/:timelineId/events/:eventId
Update event

##### DELETE /worldbuilding/timelines/:timelineId/events/:eventId
Delete event

#### Locations

##### GET /worldbuilding/locations
Get all locations

##### POST /worldbuilding/locations
Create a location

**Request:**
```json
{
  "name": "The Capital",
  "type": "city",
  "description": "...",
  "parentLocationId": "uuid",
  "coordinates": {
    "lat": 45.5,
    "lng": -73.5
  }
}
```

##### GET /worldbuilding/locations/:id
Get location by ID

##### PUT /worldbuilding/locations/:id
Update location

##### DELETE /worldbuilding/locations/:id
Delete location

#### Generic Worldbuilding Objects

##### GET /worldbuilding/objects
Get all worldbuilding objects

**Query Parameters:**
- `type`: Filter by object type
- `projectId`: Filter by project
- `search`: Full-text search

##### POST /worldbuilding/objects
Create a worldbuilding object

**Request:**
```json
{
  "type": "magic_system",
  "projectId": "uuid",
  "data": {
    "name": "Elemental Magic",
    "rules": "...",
    "powerLevels": ["Novice", "Adept", "Master"]
  },
  "relationships": [
    {
      "targetId": "uuid",
      "targetType": "character",
      "relationshipType": "uses"
    }
  ]
}
```

##### GET /worldbuilding/objects/:id
Get object by ID

##### PUT /worldbuilding/objects/:id
Update object

##### DELETE /worldbuilding/objects/:id
Delete object

### Publishing Endpoints

#### POST /publishing/export/ebook
Generate ebook

**Request:**
```json
{
  "projectId": "uuid",
  "format": "epub", // or "mobi"
  "options": {
    "coverImage": "url",
    "title": "My Novel",
    "author": "John Doe",
    "includeTOC": true
  }
}
```

**Response:**
```json
{
  "jobId": "uuid",
  "status": "processing"
}
```

#### GET /publishing/export/:jobId
Get export job status

**Response:**
```json
{
  "status": "completed",
  "downloadUrl": "https://...",
  "expiresAt": "2024-01-02T00:00:00Z"
}
```

#### POST /publishing/export/word
Generate Word document

**Request:**
```json
{
  "projectId": "uuid",
  "options": {
    "includeChapters": ["uuid1", "uuid2"],
    "formatting": {
      "font": "Times New Roman",
      "fontSize": 12
    }
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Error Codes
- `AUTH_REQUIRED`: Authentication required
- `AUTH_INVALID`: Invalid credentials
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Request validation failed
- `PERMISSION_DENIED`: User doesn't have permission
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `SERVER_ERROR`: Internal server error

## Rate Limiting

[Define rate limits]

**Examples:**
- Authentication endpoints: 5 requests/minute
- Read endpoints: 100 requests/minute
- Write endpoints: 30 requests/minute
- Export endpoints: 10 requests/hour

## Versioning

### API Versioning Strategy
[ ] URL versioning: `/api/v1/...`
[ ] Header versioning: `Accept: application/vnd.api+json;version=1`
[ ] Other: _______

## Webhooks (Optional)

### Webhook Events
[If you plan to support webhooks]

- `project.created`
- `chapter.updated`
- `export.completed`
- etc.

## API Documentation

### Documentation Tool
[ ] Swagger/OpenAPI
[ ] Postman Collection
[ ] Custom documentation
[ ] Other: _______
