# User Flows

## Overview

This document describes **how users interact with the system** through complete workflows. User flows map the step-by-step journey users take to accomplish specific goals, including decision points, system responses, and alternative paths.

> 📘 **Related Documents**:
> - [use-cases.md](./use-cases.md) - What users can do (features and scenarios)
> - [architecture.md](./architecture.md) - System architecture
> - [tech-stack.md](./tech-stack.md) - Technologies used

---

## Document Purpose

**User Flows** answer:
- HOW does a user accomplish a task?
- What is the step-by-step interaction sequence?
- What happens at each step?
- Where do users make decisions?
- What are alternative paths?

**Use this document when:**
- Building UI/UX flows
- Implementing multi-step processes
- Understanding user journey
- Identifying edge cases in workflows
- Planning error handling in user context

---

## User Personas

### Primary Personas

#### Quest Creator (B2B Client)
**Profile:**
- Company HR manager or event organizer
- Creating quests for team building or onboarding
- Needs: Easy quest creation, customization, analytics

**Technical Proficiency**: Medium
**Primary Goals**: 
- Create engaging experiences for employees/participants
- Track participation and completion
- Manage multiple quests simultaneously

#### Quest Participant (B2C End User)
**Profile:**
- Employee or event participant
- Solving quests on mobile device
- Needs: Simple, fun, intuitive experience

**Technical Proficiency**: Low to Medium
**Primary Goals**:
- Complete quests and challenges
- Earn rewards
- Compete with others (optional)

#### System Administrator
**Profile:**
- Internal team member managing platform
- Needs: User management, system monitoring, support tools

**Technical Proficiency**: High
**Primary Goals**:
- Manage users and organizations
- Monitor system health
- Support troubleshooting

---

## Core User Flows

### Flow 1: Quest Creator - Create New Quest

**Goal**: Create and publish a new quest for participants

**Entry Point**: Dashboard → "Create New Quest" button

**Preconditions**:
- User is authenticated
- User has active subscription/credits

#### Main Flow

```
1. Creator clicks "Create New Quest"
   ↓
2. System displays quest template selection
   - Pre-built templates (treasure hunt, onboarding, scavenger hunt)
   - Blank template
   ↓
3. Creator selects template
   ↓
4. System navigates to Quest Builder
   ↓
5. Creator configures basic settings
   Input: 
   - Quest name
   - Description
   - Start/end dates (optional)
   - Participant access (public link / private / organization only)
   ↓
6. Creator adds challenges/steps
   For each challenge:
   - Challenge type (location-based, answer-based, date-based, QR code)
   - Challenge title and instructions
   - Unlock conditions
   - Points/rewards
   - Hints (optional)
   ↓
7. Creator configures unlock logic
   - Sequential (one after another)
   - Parallel (all available)
   - Conditional (based on answers/location/date)
   ↓
8. Creator previews quest
   System shows: Flow visualization, estimated completion time
   ↓
9. Creator clicks "Publish Quest"
   ↓
10. System validates quest
    Checks:
    - All required fields filled
    - At least one challenge exists
    - Unlock logic is valid
    - Dates are valid (if set)
    ↓
11. System publishes quest
    ↓
12. System generates shareable link/QR code
    ↓
13. Creator receives confirmation
    Display: Quest URL, QR code, embed code
```

#### Alternative Paths

**Alt 4a**: Creator saves as draft
```
4a. Creator clicks "Save Draft"
    ↓
System saves quest in draft state
    ↓
Creator returns to dashboard
```

**Alt 10a**: Validation fails
```
10a. System finds validation errors
     ↓
System highlights errors with red indicators
     ↓
System displays error messages
     ↓
Creator fixes errors
     ↓
Return to step 9
```

**Alt 10b**: Creator cancels
```
10b. Creator clicks "Cancel"
     ↓
System prompts: "Save as draft or discard?"
     ↓
If Save: Go to Alt 4a
If Discard: Return to dashboard
```

#### Error Scenarios

**Network Error During Publish:**
```
System shows: "Connection lost. Quest saved as draft."
Creator can retry later from drafts
```

**Invalid Dates:**
```
System shows: "End date must be after start date"
Highlights date fields in red
Creator corrects dates
```

---

### Flow 2: Quest Participant - Join and Complete Quest

**Goal**: Access a quest and complete challenges

**Entry Point**: Received quest link via email/SMS/QR code

**Preconditions**:
- Quest is published and active
- Current date is within quest availability window (if set)

#### Main Flow

```
1. Participant clicks quest link or scans QR code
   ↓
2. System loads quest landing page
   Display:
   - Quest title and description
   - Creator information
   - Number of challenges
   - Estimated time
   - "Start Quest" button
   ↓
3. Participant clicks "Start Quest"
   ↓
4. System checks authentication
   ↓ (If not authenticated)
5. System displays sign-up/login options
   Options:
   - Email + password
   - Social login (Google, Microsoft)
   - Continue as guest (if allowed)
   ↓
6. Participant authenticates or continues as guest
   ↓
7. System creates participant session
   ↓
8. System displays first available challenge(s)
   Display:
   - Challenge instructions
   - Input method (text box, location permission, QR scanner)
   - Hint button (if hints available)
   - Progress indicator (e.g., "1 of 5 challenges")
   ↓
9. Participant attempts challenge
   ↓
10. System validates answer/completion
    ↓ (If correct)
11. System shows success animation
    Display:
    - "Correct!" message
    - Points earned
    - Progress updated
    ↓
12. System unlocks next challenge(s)
    ↓
13. System displays next challenge
    ↓
Repeat steps 9-13 until all challenges complete
    ↓
14. System shows completion screen
    Display:
    - "Quest Complete!" message
    - Total points earned
    - Time taken
    - Leaderboard position (if enabled)
    - Share buttons (social media)
```

#### Alternative Paths

**Alt 10a**: Answer is incorrect
```
10a. System shows: "Not quite right. Try again."
     ↓
If hints available: Display "Use a hint?" button
     ↓
Participant tries again or uses hint
     ↓
Return to step 9
```

**Alt 10b**: Location-based challenge
```
10b. Challenge requires GPS location
     ↓
System requests location permission
     ↓
If granted:
  System checks user location against target
  If within range: Go to step 11
  If outside range: Show distance to target
If denied:
  System shows: "Location access required for this challenge"
  Option to enable or skip (if skipping allowed)
```

**Alt 8a**: Participant pauses quest
```
8a. Participant closes app/browser
    ↓
System saves progress automatically
    ↓
When participant returns:
  System loads from last completed challenge
  Display: "Welcome back! Continue where you left off?"
```

#### Error Scenarios

**Network Error During Answer Submission:**
```
System shows: "Couldn't submit answer. Retrying..."
System queues answer locally
Automatically retries when connection restored
```

**Location Services Unavailable:**
```
System shows: "Cannot access location. Check device settings."
Provides fallback option (manual verification code if configured)
```

---

### Flow 3: Quest Creator - View Analytics

**Goal**: Monitor quest performance and participant progress

**Entry Point**: Dashboard → Quest card → "View Analytics"

**Preconditions**:
- Quest is published
- User has permission to view analytics

#### Main Flow

```
1. Creator clicks "View Analytics" on quest card
   ↓
2. System loads analytics dashboard
   Display:
   - Overview metrics
   - Participant list
   - Completion funnel
   - Time-based charts
   ↓
3. Overview Metrics Section
   Display:
   - Total participants: X
   - Completion rate: Y%
   - Average time: Z minutes
   - Active now: N participants
   ↓
4. Participant List Section
   Display: Table with columns:
   - Participant name/email
   - Progress (X/Y challenges)
   - Status (in progress / completed / abandoned)
   - Start time
   - Last activity
   Actions:
   - Filter by status
   - Sort by any column
   - Export to CSV
   ↓
5. Completion Funnel Section
   Display: Visualization showing:
   - Started: 100%
   - Challenge 1 completed: 85%
   - Challenge 2 completed: 70%
   - Challenge 3 completed: 60%
   - Quest completed: 50%
   ↓
6. Time Analysis Section
   Display: Chart showing:
   - Participation over time (daily/hourly)
   - Average time per challenge
   - Drop-off points
```

#### Alternative Paths

**Alt 4a**: Export participant data
```
4a. Creator clicks "Export CSV"
    ↓
System generates CSV file with participant data
    ↓
System downloads file
```

**Alt 5a**: Identify bottleneck challenge
```
5a. Creator sees high drop-off at Challenge 3
    ↓
Creator clicks Challenge 3 in funnel
    ↓
System shows detailed Challenge 3 analytics:
  - Average attempts before success
  - Hint usage rate
  - Time spent
    ↓
Creator decides to add more hints or adjust difficulty
    ↓
Return to Flow 1 to edit quest
```

---

### Flow 4: System Administrator - Manage Organizations

**Goal**: Create and configure organization accounts

**Entry Point**: Admin Panel → "Organizations"

**Preconditions**:
- User has admin role

#### Main Flow

```
1. Admin navigates to Organizations page
   ↓
2. System displays organization list
   Display: Table showing:
   - Organization name
   - Plan/tier
   - Active quests
   - Total participants
   - Status (active/suspended)
   ↓
3. Admin clicks "Add Organization"
   ↓
4. System displays organization creation form
   ↓
5. Admin enters organization details
   Input:
   - Organization name
   - Primary contact email
   - Plan/tier selection
   - Monthly quest limit
   - Monthly participant limit
   - Features enabled (custom branding, analytics, API access)
   ↓
6. Admin clicks "Create Organization"
   ↓
7. System validates input
   ↓
8. System creates organization
   ↓
9. System sends invitation email to primary contact
   ↓
10. System displays success message
    Display: Organization ID, login instructions sent
```

---

## Edge Cases & Special Scenarios

### Scenario 1: Guest User Completes Quest
**Situation**: User completed quest as guest, wants to save progress

```
Flow:
1. Guest completes quest
2. System shows: "Create account to save your progress?"
3. If Yes:
   - User creates account
   - System associates quest completion with account
   - User can view in history
4. If No:
   - Progress shown but not saved
   - User receives completion certificate via email (if provided)
```

### Scenario 2: Quest Modified After Participants Started
**Situation**: Creator edits quest that already has active participants

```
Flow:
1. Creator modifies published quest
2. System prompts: "X participants in progress. Changes affect them?"
3. Options:
   a) "Apply to new participants only" (versioning)
   b) "Apply to everyone" (update existing)
   c) "Cancel"
4. System applies choice and logs change
```

### Scenario 3: Multiple Correct Answers Submitted Simultaneously
**Situation**: Network lag causes answer to be submitted twice

```
Flow:
1. System receives duplicate submission
2. System checks for idempotency (submission ID)
3. System processes only first submission
4. System ignores duplicate
5. No error shown to user
```

---

## Flow Notation Guide

### Symbols Used
- `→` or `↓`: Next step in sequence
- `(If condition)`: Conditional branch
- `Alt Xa`: Alternative path from step X
- `Display:`: What user sees
- `Input:`: What user provides
- `System:`: Automatic system action

### Decision Points
```
Step N: System checks condition
    ↓ (If condition A)
Path A steps...
    ↓ (If condition B)
Path B steps...
```

---

## Maintenance

- **Update Frequency**: When features change or new flows added
- **Last Updated**: November 25, 2025
- **Next Review**: After major feature releases
- **Maintained By**: Product & Development Team

---

## Related Resources

- [Use Cases](./useCases.md) - What users can do
- [Architecture](./architecture.md) - System design