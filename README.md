# ReviewNow - Organization Review Platform

A full-stack application for managing and reviewing organizations, built with Express.js, React, TypeScript, and Supabase.

## 🚀 Features

- User authentication and authorization
- Organization management (CRUD operations)
- Review system for organizations
- Dashboard with analytics
- Responsive design with Tailwind CSS
- Chart visualizations

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- Sequelize ORM
- MySQL Database
- JSON Web Tokens (JWT)
- Bcrypt for password hashing
- CORS enabled
- Supabase integration

### Frontend
- React 18
- TypeScript
- Vite
- React Router v6
- Tailwind CSS
- Radix UI components
- Recharts & Chart.js
- React Hot Toast
- Supabase Client

## 📋 Prerequisites

- Node.js >= 18
- MySQL
- npm or yarn
- Git

## 🔧 Installation & Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd <repository-name>
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

Configure your `.env` file:
```env
PORT=3000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
```

Configure your frontend `.env` file:
```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the Backend**
```bash
cd backend
npm run dev
```
The server will start on http://localhost:3000

2. **Start the Frontend**
```bash
cd frontend
npm run dev
```
The development server will start on http://localhost:5173

### Production Build

1. **Backend**
```bash
cd backend
npm start
```

2. **Frontend**
```bash
cd frontend
npm run build
npm run preview
```

## 📁 Project Structure

### Backend Structure
```
backend/
├── config/         # Database and other configuration
├── controllers/    # Request handlers
├── models/        # Sequelize models
├── routes/        # API routes
├── .env           # Environment variables
├── server.js      # Entry point
└── package.json   # Dependencies
```

### Frontend Structure
```
frontend/
├── public/        # Static files
├── src/
│   ├── components/    # React components
│   ├── service/      # API services
│   ├── utils/        # Utility functions
│   ├── lib/          # Library code
│   ├── App.tsx       # Main component
│   └── index.css     # Global styles
└── package.json      # Dependencies
```

## 🔒 API Endpoints

### Authentication
```
POST /api/auth/login    # User login
POST /api/auth/register # User registration
```

### Organizations
```
GET    /api/organizations     # Get all organizations
POST   /api/organizations     # Create organization
GET    /api/organizations/:id # Get single organization
<!-- PUT    /api/organizations/:id # Update organization -->
<!-- DELETE /api/organizations/:id # Delete organization -->
```

### Reviews
```
GET    /api/reviews          # Get all reviews
POST   /api/reviews          # Create review
GET    /api/reviews/:id      # Get single review
PUT    /api/reviews/:id      # Update review
DELETE /api/reviews/:id/:userId     # Delete review
```