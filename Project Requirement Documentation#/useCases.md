# Use Cases

## Overview

This document describes **what users can do** with the system. Use cases define features, functionality, and scenarios from a user's perspective, focusing on goals and outcomes rather than implementation steps.

> 📘 **Related Documents**:
> - [user-flows.md](./user-flows.md) - How users accomplish tasks (step-by-step workflows)
> - [architecture.md](./architecture.md) - System architecture
> - [api-docs.md](./api-docs.md) - API specifications

---

## Document Purpose

**Use Cases** answer:
- WHAT can users do?
- What features exist?
- What are the inputs and outputs?
- What are success and failure conditions?

**Use this document when:**
- Planning features to implement
- Understanding system capabilities
- Writing API specifications
- Defining acceptance criteria
- Scoping development work

---

## Use Case Template

Each use case follows this structure:

```
### UC-XXX: Use Case Name

**Actor**: Who performs this action
**Goal**: What the user wants to achieve
**Preconditions**: What must be true before starting
**Postconditions**: What is true after success

**Main Success Scenario:**
1. Actor does action
2. System responds
3. ...

**Extensions (Alternative Paths):**
- 2a. If condition: Alternative action
- 3a. If error: Error handling

**Business Rules:**
- Relevant constraints or rules

**Non-Functional Requirements:**
- Performance, security, or other quality requirements
```

---

## Quest Management Use Cases

### UC-001: Create Quest

**Actor**: Quest Creator (authenticated)

**Goal**: Create a new quest with challenges and publish it for participants

**Preconditions**:
- User is authenticated
- User has active subscription or available credits
- User belongs to an organization (for B2B) or has personal account

**Postconditions**:
- Quest is created and stored in database
- Quest has unique ID and shareable URL
- Quest is in "published" or "draft" state
- Creator can access quest analytics

**Main Success Scenario:**
1. Creator initiates quest creation
2. Creator selects template or starts from blank
3. Creator configures quest metadata (name, description, dates)
4. Creator adds challenges with unlock conditions
5. Creator configures rewards and scoring
6. Creator previews quest
7. Creator publishes quest
8. System validates quest configuration
9. System generates shareable URL and QR code
10. System confirms publication

**Extensions:**
- 4a. No template selected: Creator builds from scratch
- 8a. Validation fails: System shows errors, creator fixes, returns to step 7
- 7a. Creator saves as draft: Quest saved but not published, can edit later

**Business Rules:**
- BR-001: Quest must have at least one challenge
- BR-002: Quest name must be unique within organization
- BR-003: If dates set, end date must be after start date
- BR-004: Published quests can be edited but changes may affect active participants
- BR-005: Free tier limited to 5 quests per month

**Non-Functional Requirements:**
- Quest creation should complete within 2 seconds
- Quest preview should load in < 1 second
- All quest data must be backed up

---

### UC-002: Edit Existing Quest

**Actor**: Quest Creator (authenticated, owner of quest)

**Goal**: Modify quest details, challenges, or settings

**Preconditions**:
- User is authenticated
- User owns or has edit permissions for quest
- Quest exists

**Postconditions**:
- Quest is updated with new information
- If quest has active participants, changes handled according to versioning rules
- Change is logged for audit

**Main Success Scenario:**
1. Creator navigates to quest
2. Creator selects "Edit Quest"
3. System loads quest in edit mode
4. Creator modifies fields, challenges, or settings
5. Creator saves changes
6. System validates modifications
7. System updates quest
8. System notifies creator of success

**Extensions:**
- 6a. Validation fails: Show errors, return to step 4
- 4a. Quest has active participants: System prompts for versioning choice
  - Option 1: Apply to new participants only
  - Option 2: Apply to all participants
  - Option 3: Cancel changes

**Business Rules:**
- BR-006: Cannot delete challenges that participants have already completed
- BR-007: Cannot change quest type after participants have started
- BR-008: Major changes require confirmation if participants are active

**Non-Functional Requirements:**
- Save operation completes within 1 second
- Changes reflected immediately for new participants
- Audit log maintained for all changes

---

### UC-003: Delete Quest

**Actor**: Quest Creator (authenticated, owner of quest)

**Goal**: Permanently remove a quest

**Preconditions**:
- User is authenticated
- User owns quest
- Quest exists

**Postconditions**:
- Quest is marked as deleted (soft delete) or permanently removed
- Participant progress archived or deleted
- Analytics data retained for reporting
- Quest URL becomes invalid

**Main Success Scenario:**
1. Creator navigates to quest
2. Creator selects "Delete Quest"
3. System shows confirmation dialog with warning
4. Creator confirms deletion
5. System marks quest as deleted
6. System archives participant data
7. System invalidates quest URLs
8. System confirms deletion

**Extensions:**
- 4a. Creator cancels: No action taken, return to quest view
- 3a. Quest has active participants: Additional warning shown

**Business Rules:**
- BR-009: Quests with active participants require additional confirmation
- BR-010: Deleted quests retained for 30 days (soft delete) then permanently removed
- BR-011: Analytics data retained indefinitely for reporting

**Non-Functional Requirements:**
- Deletion completes within 2 seconds
- Participant data properly archived per GDPR requirements

---

### UC-004: Duplicate Quest

**Actor**: Quest Creator (authenticated)

**Goal**: Create copy of existing quest to use as starting point

**Preconditions**:
- User is authenticated
- User has access to quest being duplicated
- User has available quest credits/slots

**Postconditions**:
- New quest created with copied configuration
- New quest has unique ID and URL
- New quest starts in draft state
- Original quest unchanged

**Main Success Scenario:**
1. Creator navigates to quest
2. Creator selects "Duplicate Quest"
3. System creates copy of quest
4. System assigns new ID and "(Copy)" suffix to name
5. System sets quest to draft state
6. System opens duplicated quest in edit mode
7. Creator modifies as needed
8. Creator publishes new quest

**Extensions:**
- 3a. User at quest limit: Show upgrade prompt

**Business Rules:**
- BR-012: Duplicated quest does not copy participant data
- BR-013: Duplicated quest does not copy analytics

---

## Participant Use Cases

### UC-101: Join Quest

**Actor**: Participant (anonymous or authenticated)

**Goal**: Start participating in a quest

**Preconditions**:
- Quest is published and active
- Participant has quest link or QR code
- Current date within quest availability window (if set)

**Postconditions**:
- Participant session created
- Participant progress tracking initiated
- First available challenge displayed

**Main Success Scenario:**
1. Participant accesses quest via link or QR code
2. System loads quest landing page
3. Participant clicks "Start Quest"
4. System checks authentication status
5. If not authenticated, system offers sign-up/login or guest option
6. Participant authenticates or continues as guest
7. System creates participant session
8. System displays first challenge(s)

**Extensions:**
- 5a. Participant already authenticated: Skip to step 7
- 6a. Participant chooses guest: Limited features, optional email for completion certificate
- 4a. Quest requires authentication: Guest option not available

**Business Rules:**
- BR-101: One participation per user per quest (unless repeats allowed)
- BR-102: Guest progress not saved permanently
- BR-103: Quest access controlled by creator settings (public, organization only, invite only)

**Non-Functional Requirements:**
- Quest loads within 2 seconds
- Mobile-responsive design required
- Works offline with limited functionality

---

### UC-102: Complete Challenge

**Actor**: Participant (in active quest session)

**Goal**: Successfully complete a challenge within quest

**Preconditions**:
- Participant has active quest session
- Challenge is unlocked and available
- Participant can access challenge (location/date requirements met)

**Postconditions**:
- Challenge marked as completed
- Points awarded to participant
- Next challenge(s) unlocked (if conditions met)
- Progress saved

**Main Success Scenario:**
1. Participant views challenge instructions
2. Participant attempts challenge (submits answer, scans QR, reaches location, etc.)
3. System validates attempt
4. System confirms success
5. System awards points
6. System updates progress
7. System unlocks next challenge(s)
8. System displays next challenge

**Extensions:**
- 3a. Validation fails: Show "Try again" message, allow retry
- 3b. Hint requested: Show hint (if available), may deduct points
- 3c. Challenge skipped: If skipping allowed, mark as skipped, continue
- 2a. Location-based: Request location permission, validate GPS coordinates
- 2b. Date-based: Automatically unlock when date reached
- 2c. QR code: Open camera, scan code, validate

**Business Rules:**
- BR-104: Incorrect answers may limit retry attempts (if configured)
- BR-105: Hints available after X failed attempts (if configured)
- BR-106: Time bonuses apply if configured
- BR-107: Some challenges may require specific conditions (time, location)

**Non-Functional Requirements:**
- Answer validation completes within 500ms
- Location accuracy within 50 meters
- Offline answers queued and synced when online

---

### UC-103: View Progress

**Actor**: Participant (in active or completed quest)

**Goal**: Check current progress and stats

**Preconditions**:
- Participant has quest session (active or completed)
- Participant is authenticated (if not guest)

**Postconditions**:
- None (read-only operation)

**Main Success Scenario:**
1. Participant opens progress view
2. System displays:
   - Challenges completed / total
   - Points earned
   - Time elapsed
   - Current rank (if leaderboard enabled)
   - Remaining challenges
3. Participant reviews progress

**Extensions:**
- 2a. Quest completed: Show completion summary, total time, final rank
- 2b. Leaderboard disabled: Rank not shown

**Business Rules:**
- BR-108: Guest users see limited progress (current session only)
- BR-109: Authenticated users see history of all quests

---

### UC-104: Request Hint

**Actor**: Participant (in active quest session)

**Goal**: Get help with difficult challenge

**Preconditions**:
- Participant stuck on challenge
- Hints available for challenge
- Participant hasn't used all hints

**Postconditions**:
- Hint displayed to participant
- Hint usage recorded
- Points may be deducted (if configured)

**Main Success Scenario:**
1. Participant clicks "Get Hint" button
2. System checks hint availability
3. System displays hint
4. System deducts points (if configured)
5. Participant uses hint to solve challenge

**Extensions:**
- 2a. No hints available: Button disabled or not shown
- 2b. All hints used: Show "No more hints" message

**Business Rules:**
- BR-110: Hints may have point cost
- BR-111: Limited number of hints per challenge
- BR-112: Hints revealed progressively (hint 1, then hint 2, etc.)

---

## Analytics Use Cases

### UC-201: View Quest Analytics

**Actor**: Quest Creator (authenticated, quest owner)

**Goal**: Monitor quest performance and participant behavior

**Preconditions**:
- User is authenticated
- User owns quest
- Quest exists and has data

**Postconditions**:
- None (read-only operation)

**Main Success Scenario:**
1. Creator selects quest
2. Creator opens analytics view
3. System displays:
   - Total participants
   - Completion rate
   - Average time
   - Participant list with progress
   - Completion funnel
   - Time-based charts
4. Creator analyzes data
5. Creator makes decisions based on insights

**Extensions:**
- 4a. Export data: Creator downloads CSV
- 4b. Filter data: Creator applies filters (date range, status)
- 4c. Identify bottleneck: Creator sees drop-off point, edits quest

**Business Rules:**
- BR-201: Analytics update in real-time
- BR-202: Historical data retained indefinitely
- BR-203: Anonymous analytics for guest participants

**Non-Functional Requirements:**
- Analytics dashboard loads within 3 seconds
- Real-time updates within 30 seconds
- Can handle 10,000+ participant records

---

### UC-202: Export Participant Data

**Actor**: Quest Creator (authenticated, quest owner)

**Goal**: Download participant data for external analysis

**Preconditions**:
- User is authenticated
- User owns quest
- Quest has participant data

**Postconditions**:
- CSV file downloaded with participant data
- Download logged for audit

**Main Success Scenario:**
1. Creator opens quest analytics
2. Creator clicks "Export CSV"
3. System generates CSV with participant data
4. System downloads file
5. Creator uses data in external tools

**Extensions:**
- 3a. Large dataset: System queues export, emails download link
- 2a. Select specific fields: Creator chooses columns to include

**Business Rules:**
- BR-204: Exported data complies with GDPR
- BR-205: PII included only with proper permissions
- BR-206: Export action logged for audit

---

## Administration Use Cases

### UC-301: Manage Organizations

**Actor**: System Administrator

**Goal**: Create and configure organization accounts

**Preconditions**:
- User has admin role
- User is authenticated

**Postconditions**:
- Organization created or updated
- Primary contact receives invitation
- Organization visible in admin panel

**Main Success Scenario:**
1. Admin navigates to organizations
2. Admin clicks "Add Organization"
3. Admin enters organization details
4. Admin configures plan and limits
5. Admin saves organization
6. System creates organization
7. System sends invitation email
8. System confirms creation

**Extensions:**
- 3a. Edit existing: Load existing data, allow modifications
- 6a. Validation fails: Show errors, return to step 3

**Business Rules:**
- BR-301: Each organization has unique ID
- BR-302: Organization name must be unique
- BR-303: Plan determines feature access

---

### UC-302: Monitor System Health

**Actor**: System Administrator

**Goal**: Check system status and performance

**Preconditions**:
- User has admin role
- User is authenticated

**Postconditions**:
- None (read-only operation)

**Main Success Scenario:**
1. Admin opens monitoring dashboard
2. System displays:
   - Service status (API, database, cache)
   - Performance metrics (response time, throughput)
   - Error rates
   - Active users
   - Resource usage
3. Admin reviews metrics
4. If issues found, admin investigates

**Extensions:**
- 3a. Service down: Alert shown, admin takes action
- 3b. High error rate: Admin checks error logs

**Business Rules:**
- BR-304: Real-time monitoring required
- BR-305: Alerts sent for critical issues

---

## Feature Matrix

| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Create quests | 5/month | Unlimited | Unlimited |
| Participants per quest | 100 | 1,000 | Unlimited |
| Custom branding | ❌ | ✅ | ✅ |
| Analytics | Basic | Advanced | Advanced + Export |
| API access | ❌ | ❌ | ✅ |
| Priority support | ❌ | ✅ | ✅ |
| Team collaboration | ❌ | 5 users | Unlimited |

---

## Non-Functional Requirements Summary

### Performance
- Page load time: < 2 seconds
- API response time: < 500ms (95th percentile)
- Support 1,000 concurrent users per instance

### Security
- HTTPS required for all connections
- Authentication via JWT
- GDPR compliant data handling
- Regular security audits

### Availability
- 99.9% uptime SLA for paid plans
- Automated backups every 6 hours
- Disaster recovery plan in place

### Scalability
- Horizontal scaling supported
- Support 100,000 active quests
- Support 1,000,000 participants

---

## Maintenance

- **Update Frequency**: When features added or changed
- **Last Updated**: November 25, 2025
- **Next Review**: After each sprint/milestone
- **Maintained By**: Product & Development Team