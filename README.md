# RoleSphere - Role-Based Access Control Dashboard

A full-stack application with Next.js frontend and Node.js/Express backend demonstrating role-based access control and permissions.

## Features

- **Role-Based Access Control (RBAC)**:
  - Admin: Full system access, user management, log viewing
  - Editor: Content creation and management
  - Viewer: Read-only access to content

- **Authentication & Authorization**:
  - JWT-based authentication
  - Role-based route protection (both frontend and backend)
  - Session persistence

- **User Management (Admin only)**:
  - List all users
  - Update user roles
  - Delete user accounts

- **Content Management**:
  - Create, view, edit, and delete posts (Editor+ roles)
  - Read-only access for Viewers

- **System Logs (Admin only)**:
  - Activity tracking
  - User action history

## Tech Stack

- **Frontend**:
  - Next.js (App Router)
  - TypeScript
  - TailwindCSS
  - lucide-react (for icons)
  - Context API for state management

- **Backend**:
  - Node.js with Express
  - MongoDB with Mongoose
  - JWT for authentication
  - bcrypt for password hashing

## Project Structure

```
/
├── client/               # Next.js frontend
│   ├── app/              # App router pages
│   │   ├── dashboard/    # Dashboard routes
│   │   └── login/        # Authentication
│   ├── components/       # React components
│   ├── context/          # Context providers
│   ├── types/            # TypeScript types
│   └── utils/            # Helper utilities
│
└── server/               # Express backend
    ├── config/           # Configuration files
    ├── controllers/      # Route controllers
    ├── middleware/       # Express middleware
    ├── models/           # Mongoose models
    ├── routes/           # API routes
    └── scripts/          # Utility scripts including database seeding
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local instance or MongoDB Atlas)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/RY-RahulYadav/RoleSphere.git
   cd RoleSphere
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd client
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the server directory with the following:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rolesphere
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   ```
   
   > **MongoDB Connection Options**:
   > - For local MongoDB: `mongodb://localhost:27017/rolesphere`
   > - For MongoDB Atlas: `mongodb+srv://<user>:<password>@cluster0.p8nvvwg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

### Database Seeding

To populate the database with initial users and roles:

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Run the seed script:
   ```bash
   npm run seed
   ```

3. This will create three default users with the following credentials:

   | Role    | Email               | Password    |
   |---------|---------------------|-------------|
   | Admin   | admin@example.com   | Admin123! |
   | Editor  | editor@example.com  | Editor123@ |
   | Viewer  | viewer@example.com  | Viewer123# |

   > **Important**: Change these default passwords in a production environment.

### Running the Application

1. Start the server:
   ```bash
   cd server
   npm run dev
   ```

2. In a new terminal, start the client:
   ```bash
   cd client
   npm run dev
   ```

3. Access the application at `http://localhost:3000`


## User Roles and Permissions

1. **Admin**:
   - Full access to all features
   - User management (create, update roles, delete)
   - System logs viewing
   - Content management

2. **Editor**:
   - Create, edit, and delete their own posts
   - Cannot access user management or logs

3. **Viewer**:
   - Can only view content
   - No edit capabilities
   - Limited dashboard access

## Security Implementation

- Backend route protection using Express middleware
- Frontend conditional rendering and route guards
- JWT token validation on all protected routes
- Password hashing for secure storage
- Activity logging for security auditing
- Automatic post deletion when a user is deleted
