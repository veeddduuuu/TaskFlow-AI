# TaskFlow AI

# **Product Requirements Document (PRD)**

# TaskFlow AI Backend

---

### 1. Product Overview

**Product Name:** TaskFlow AI Backend
**Version:** 1.0.0
**Product Type:** Backend API for AI-Assisted Project Execution System

TaskFlow AI Backend is a RESTful API designed to support collaborative project execution for student teams. Unlike traditional project management systems, TaskFlow focuses on **execution over planning** by providing intelligent daily task recommendations based on deadlines, priorities, and team dependencies.

---

### 2. Target Users

- **Project Owners (Admin):** Create projects, manage members, oversee execution
- **Team Leads (Project Admin):** Manage tasks, assign work, monitor progress
- **Team Members:** Execute assigned tasks and track progress

---

### 3. Core Features

---

### 3.1 User Authentication & Authorization

- [x]  **User Registration:** Account creation with email and password
- [x]  **User Login:** JWT-based authentication (access + refresh tokens)
- [x]  **Token Management:** Refresh token mechanism for session continuity
- [x]  **Password Management:** Change password and reset functionality
- [x]  **Role-Based Access Control:** Admin / Project Admin / Member roles
- [x]  **Secure Middleware:** Protected routes with authentication checks

---

### 3.2 Project Management

- [x]  **Project Creation:** Create new projects with metadata
- [x]  **Project Listing:** Retrieve all projects for a user
- [x]  **Project Details:** View project-specific information
- [x]  **Project Updates:** Modify project details (Admin only)
- [x]  **Project Deletion:** Remove project (Admin only)

---

### 3.3 Team Member Management

- [x]  **Member Invitation:** Add users to projects
- [x]  **Member Listing:** View all team members
- [x]  **Role Assignment:** Assign roles (Admin only)
- [x]  **Member Removal:** Remove users from project (Admin only)

---

### 3.4 Task Management

- [ ]  **Task Creation:** Create tasks with title, description, deadline, priority
- [ ]  **Task Assignment:** Assign tasks to team members
- [ ]  **Task Listing:** Retrieve tasks within a project
- [ ]  **Task Updates:** Modify task details and status
- [ ]  **Task Deletion:** Remove tasks
- [ ]  **Status Tracking:** (Todo, In Progress, Done)
- [ ]  **Priority Levels:** (Low, Medium, High)

---

### 3.5 Subtask Management

- [ ]  **Subtask Creation:** Break tasks into smaller units
- [ ]  **Subtask Updates:** Modify subtask details and completion status
- [ ]  **Subtask Deletion:** Remove subtasks
- [ ]  **Completion Tracking:** Mark subtasks as complete

---

### 3.6 🧠 Daily Execution Engine (Core Differentiator)

- **Purpose:** Recommend what a user should work on daily

**Inputs:**

- Task deadlines
- Priority levels
- Task status
- User assignment
- Dependency status (blocked/unblocked tasks)

**Outputs:**

- Ordered list of recommended tasks for the day

**Behavior:**

- Prioritizes urgent and high-impact tasks
- Avoids blocked or dependent tasks
- Dynamically updates based on progress

---

### 3.7 👥 Team Awareness

- Identify task dependencies
- Highlight blocked tasks
- Provide contextual insights (e.g., waiting on another user)

---

### 3.8 🤖 AI Integration

- Natural language → task creation
- AI-assisted prioritization reasoning (optional)

---

### 3.9 System Health

- API health check endpoint

---

## 4. Technical Specifications

---

### 4.1 API Endpoints Structure

**Authentication Routes** (`/api/v1/auth/`)

- `POST /register` – Register user
- `POST /login` – Login user
- `POST /logout` – Logout user (secured)
- `GET /current-user` – Get current user (secured)
- `POST /change-password` – Change password (secured)
- `POST /refresh-token` – Refresh access token

---

**Project Routes** (`/api/v1/projects/`)

- `GET /` – Get user projects (secured)
- `POST /` – Create project (secured)
- `GET /:projectId` – Get project details (secured)
- `PUT /:projectId` – Update project (Admin only)
- `DELETE /:projectId` – Delete project (Admin only)

---

**Membership Routes** (`/api/v1/members/`)

- `GET /:projectId` – List members
- `POST /:projectId` – Add member (Admin only)
- `PUT /:projectId/:userId` – Update role (Admin only)
- `DELETE /:projectId/:userId` – Remove member (Admin only)

---

**Task Routes** (`/api/v1/tasks/`)

- `GET /:projectId` – List tasks
- `POST /:projectId` – Create task
- `GET /:projectId/t/:taskId` – Task details
- `PUT /:projectId/t/:taskId` – Update task
- `DELETE /:projectId/t/:taskId` – Delete task

---

**Subtask Routes** (`/api/v1/subtasks/`)

- `POST /:taskId` – Create subtask
- `PUT /:subtaskId` – Update subtask
- `DELETE /:subtaskId` – Delete subtask

---

**Execution Routes (Core Feature)** (`/api/v1/execution/`)

- `GET /daily` – Get daily execution plan for user

---

**Health Check** (`/api/v1/healthcheck/`)

- `GET /` – System status

---

---

### 4.2 Permission Matrix

| Feature | Admin | Project Admin | Member |
| --- | --- | --- | --- |
| Create Project | ✓ | ✗ | ✗ |
| Update/Delete Project | ✓ | ✗ | ✗ |
| Manage Members | ✓ | ✗ | ✗ |
| Create/Update/Delete Tasks | ✓ | ✓ | ✗ |
| View Tasks | ✓ | ✓ | ✓ |
| Update Task Status | ✓ | ✓ | ✓ |
| Manage Subtasks | ✓ | ✓ | ✗ |
| View Execution Plan | ✓ | ✓ | ✓ |

---

### 4.3 Data Models

**User Roles:**

- `admin`
- `project_admin`
- `member`

**Task Status:**

- `todo`
- `in_progress`
- `done`

**Priority Levels:**

- `low`
- `medium`
- `high`

---

### 5. Security Features

- JWT-based authentication (access + refresh tokens)
- Role-based authorization middleware
- Input validation on all endpoints
- Secure password hashing (bcrypt)
- CORS configuration

---

### 6. Success Criteria

- Users can create and manage projects
- Tasks and subtasks function correctly
- Role-based access is enforced
- Daily execution engine generates meaningful task recommendations

---

### 7. Key Differentiator

> TaskFlow AI is not just a project management tool —
it is an **execution engine that tells users what to work on daily.**
> 

---

### 8. Risks

- Poor prioritization logic reduces usefulness
- Over-reliance on AI instead of core logic
- Feature creep during development

---

### 9. Future Enhancements

- Smarter workload balancing
- AI-based time estimation
- Notifications and reminders
- Advanced team analytics

---

### 10. Guiding Principle

> If the system cannot clearly answer
**“What should I work on today?” — it fails.**
>