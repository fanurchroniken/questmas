# Data Model Documentation

## Database Schema Overview

[Describe your overall database architecture - relational vs document, etc.]

## Core Entities

### Users
```sql
-- Template for user table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  -- Add more fields as needed
);
```

**Fields to Consider:**
- [ ] Email
- [ ] Password (hashed)
- [ ] Name/Display name
- [ ] Avatar/Profile picture
- [ ] Subscription tier
- [ ] Preferences (JSON)
- [ ] Created/Updated timestamps
- [ ] Last login
- [ ] Email verification status

### Projects/Novels
```sql
-- Template for projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  -- Add more fields as needed
);
```

**Fields to Consider:**
- [ ] Title
- [ ] Description/Summary
- [ ] Cover image
- [ ] Word count
- [ ] Target word count
- [ ] Status (draft, in-progress, completed)
- [ ] Created/Updated timestamps
- [ ] Metadata (JSON)

### Chapters
```sql
-- Template for chapters table
CREATE TABLE chapters (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  title VARCHAR(255),
  content TEXT,
  order_index INTEGER,
  word_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  -- Add more fields as needed
);
```

**Fields to Consider:**
- [ ] Title
- [ ] Content (rich text or markdown)
- [ ] Order/Position
- [ ] Word count
- [ ] Status
- [ ] Tags (array or relation)
- [ ] Notes
- [ ] Created/Updated timestamps
- [ ] Version history

### Tags
```sql
-- Template for tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7), -- Hex color
  created_at TIMESTAMP DEFAULT NOW(),
  -- Add more fields as needed
);
```

**Fields to Consider:**
- [ ] Name
- [ ] Color
- [ ] Description
- [ ] Usage count

## Worldbuilding Entities

### Characters
[Choose: Relational table OR Document in object database]

**If Relational:**
```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id), -- Optional: link to specific project
  name VARCHAR(255) NOT NULL,
  -- Add standard fields
  custom_fields JSONB, -- For flexible schema
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**If Document (MongoDB example):**
```javascript
{
  _id: ObjectId,
  userId: UUID,
  projectId: UUID, // Optional
  name: String,
  // Standard fields
  customFields: {}, // Flexible schema
  relationships: [], // Links to other entities
  createdAt: Date,
  updatedAt: Date
}
```

**Standard Fields to Consider:**
- [ ] Name
- [ ] Age
- [ ] Gender
- [ ] Description/Appearance
- [ ] Personality traits
- [ ] Backstory
- [ ] Relationships (links to other characters)
- [ ] Images
- [ ] Notes
- [ ] Custom fields (flexible schema)

### Timelines
**Structure:**
```sql
CREATE TABLE timelines (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE timeline_events (
  id UUID PRIMARY KEY,
  timeline_id UUID REFERENCES timelines(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date_value VARCHAR(100), -- Flexible date format
  date_order INTEGER, -- For sorting
  linked_entities JSONB, -- Links to characters, locations, etc.
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Fields to Consider:**
- [ ] Timeline name
- [ ] Events with dates
- [ ] Event descriptions
- [ ] Links to characters/locations
- [ ] Event ordering

### Locations
**Structure:**
```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100), -- city, country, building, etc.
  parent_location_id UUID REFERENCES locations(id), -- For hierarchy
  description TEXT,
  coordinates JSONB, -- For mapping
  images TEXT[], -- Array of image URLs
  custom_fields JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Fields to Consider:**
- [ ] Name
- [ ] Type/Category
- [ ] Parent location (for hierarchy)
- [ ] Description
- [ ] Coordinates (for mapping)
- [ ] Images/Maps
- [ ] Linked entities
- [ ] Custom fields

## Object Database Schema (Worldbuilding Objects)

### Generic Object Structure
[If using a document/object database for flexible worldbuilding]

```javascript
{
  _id: ObjectId,
  userId: UUID,
  projectId: UUID, // Optional
  type: String, // "character", "location", "custom_type", etc.
  schema: String, // Schema version or identifier
  data: {
    // Flexible structure based on type
    // Example for custom "magic_system" type:
    name: String,
    rules: String,
    powerLevels: Array,
    // ... any custom fields
  },
  relationships: [
    {
      targetId: UUID,
      targetType: String,
      relationshipType: String, // "belongs_to", "related_to", etc.
    }
  ],
  metadata: {
    tags: Array,
    notes: String,
    version: Number,
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Considerations:**
- [ ] Flexible schema per object type
- [ ] Versioning support
- [ ] Relationship/linking system
- [ ] Search/indexing strategy
- [ ] Migration strategy for schema changes

## Relationships

### Entity Relationships Diagram
[Create or describe your ERD]

**Key Relationships:**
- User → Projects (1:many)
- Project → Chapters (1:many)
- Chapter → Tags (many:many)
- User → Worldbuilding Objects (1:many)
- Worldbuilding Objects → Worldbuilding Objects (many:many, via relationships)

## Indexes

### Performance Indexes
```sql
-- Example indexes to consider
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_chapters_project_id ON chapters(project_id);
CREATE INDEX idx_chapters_tags ON chapters USING GIN(tags);
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_timeline_events_timeline_id ON timeline_events(timeline_id);
-- Add more as needed
```

**Indexes to Consider:**
- [ ] User ID indexes (for multi-tenancy)
- [ ] Project ID indexes
- [ ] Full-text search indexes
- [ ] Tag indexes
- [ ] Date/time indexes for sorting

## Data Validation

### Validation Rules
[Define validation rules for each entity]

**Examples:**
- Email format validation
- Required fields
- String length limits
- JSON schema validation for custom fields
- Date format validation

## Data Migration Strategy

### Migration Approach
[How will you handle schema changes?]

**Considerations:**
- [ ] Version control for migrations
- [ ] Backward compatibility
- [ ] Data transformation scripts
- [ ] Rollback procedures

## Backup & Recovery

### Backup Strategy
[How will you backup data?]

**Considerations:**
- [ ] Frequency of backups
- [ ] Retention policy
- [ ] Point-in-time recovery
- [ ] Disaster recovery plan
