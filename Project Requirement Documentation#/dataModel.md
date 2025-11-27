# Data Model

## Overview

This document describes the database schema and data model for Captain's Quest platform.

## Database Schema

### Core Entities

#### Organizations
Stores organization information for B2B use cases (optional for MVP).

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Organization name |
| slug | TEXT | Unique URL-friendly identifier |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |
| deleted_at | TIMESTAMPTZ | Soft delete timestamp |

#### User Profiles
Extends Supabase auth.users with additional profile information.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | References auth.users(id) |
| email | TEXT | User email |
| full_name | TEXT | User's full name |
| avatar_url | TEXT | Profile picture URL |
| organization_id | UUID | Optional organization reference |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

#### Quests
Main quest entity containing quest metadata and configuration.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| creator_id | UUID | References auth.users(id) |
| organization_id | UUID | Optional organization reference |
| title | TEXT | Quest title |
| description | TEXT | Quest description |
| quest_type | quest_type | Enum: christmas_calendar, treasure_hunt, onboarding, custom |
| status | quest_status | Enum: draft, published, archived |
| theme_config | JSONB | Theme configuration (colors, fonts, recipient_first_name, etc.) |
| start_date | DATE | Optional start date |
| end_date | DATE | Optional end date |
| is_public | BOOLEAN | Whether quest is publicly accessible |
| requires_auth | BOOLEAN | Whether authentication is required |
| share_code | TEXT | Short code for shareable URLs |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |
| published_at | TIMESTAMPTZ | Publication timestamp |

#### Calendar Configs
Configuration for Christmas calendar quests.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| quest_id | UUID | References quests(id) |
| start_date | DATE | First day of calendar (e.g., Dec 1) |
| end_date | DATE | Last day of calendar (e.g., Dec 24) |
| unlock_schedule | JSONB | Custom unlock schedule if needed |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

#### Chapters
Optional grouping of tasks (for future use).

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| quest_id | UUID | References quests(id) |
| title | TEXT | Chapter title |
| description | TEXT | Chapter description |
| order_index | INTEGER | Display order |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

#### Tasks
Individual challenges/riddles within quests.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| quest_id | UUID | References quests(id) |
| chapter_id | UUID | Optional chapter reference |
| title | TEXT | Task title |
| description | TEXT | Task description |
| instructions | TEXT | Task instructions |
| task_type | TEXT | Type: answer, location, qr_code, etc. |
| unlock_trigger | unlock_trigger_type | Enum: date, answer, location, manual, sequential |
| unlock_condition | JSONB | Condition data (date, answer, coords, etc.) |
| correct_answer | TEXT | Correct answer for answer-based tasks |
| points | INTEGER | Points awarded for completion |
| order_index | INTEGER | Display order |
| hints | JSONB | Array of hints |
| metadata | JSONB | Additional task-specific data (location_description, requires_photo, etc.) |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

#### Quest Participants
User participation sessions for quests.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| quest_id | UUID | References quests(id) |
| user_id | UUID | References auth.users(id), nullable for guests |
| is_guest | BOOLEAN | Whether participant is a guest |
| guest_email | TEXT | Email for guest participants |
| status | participant_status | Enum: active, completed, abandoned |
| started_at | TIMESTAMPTZ | Start timestamp |
| completed_at | TIMESTAMPTZ | Completion timestamp |
| total_points | INTEGER | Total points earned |
| metadata | JSONB | Additional participant data |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

#### Task Completions
Records of task completions by participants.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| participant_id | UUID | References quest_participants(id) |
| task_id | UUID | References tasks(id) |
| answer | TEXT | User's answer (if applicable) |
| photo_url | TEXT | URL of photo uploaded for completion (if photo task) |
| points_earned | INTEGER | Points earned for this completion |
| hints_used | INTEGER | Number of hints used |
| attempts | INTEGER | Number of attempts before success |
| completed_at | TIMESTAMPTZ | Completion timestamp |
| metadata | JSONB | Additional completion data |
| created_at | TIMESTAMPTZ | Creation timestamp |

#### Quest Themes
Theme configurations for quests.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| quest_id | UUID | References quests(id) |
| name | TEXT | Theme name |
| colors | JSONB | Color configuration |
| fonts | JSONB | Font configuration |
| styles | JSONB | Additional style configuration |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

## Enums

### quest_type
- `christmas_calendar` - Christmas calendar with daily unlocks
- `treasure_hunt` - Treasure hunt quest
- `onboarding` - Onboarding quest
- `custom` - Custom quest type

### unlock_trigger_type
- `date` - Unlock on specific date
- `answer` - Unlock after correct answer
- `location` - Unlock at specific location
- `manual` - Manual unlock
- `sequential` - Unlock after previous task

### quest_status
- `draft` - Quest is in draft
- `published` - Quest is published
- `archived` - Quest is archived

### participant_status
- `active` - Participant is actively participating
- `completed` - Participant has completed the quest
- `abandoned` - Participant has abandoned the quest

## Relationships

- Organizations → User Profiles (one-to-many)
- Users → Quests (one-to-many, creator)
- Quests → Calendar Configs (one-to-one, for Christmas calendars)
- Quests → Chapters (one-to-many)
- Quests → Tasks (one-to-many)
- Quests → Quest Participants (one-to-many)
- Quest Participants → Task Completions (one-to-many)
- Tasks → Task Completions (one-to-many)
- Quests → Quest Themes (one-to-one)

## Row Level Security (RLS)

All tables have RLS enabled with policies that:
- Allow public read access to published, public quests
- Restrict write access to quest creators
- Allow users to view and manage their own data
- Allow quest creators to view analytics for their quests

## Indexes

Key indexes are created for:
- Foreign key relationships
- Common query patterns (status, type, dates)
- Search operations (share_code, email)
- Performance optimization for analytics queries

