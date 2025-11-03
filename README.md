# ShortStories - Property Management Platform

A comprehensive short-term rental property management system built with React, Node.js, Express, and PostgreSQL.

## Features

- 🏠 **Property Management** - Add, edit, and manage multiple rental properties
- 📅 **Booking System** - Handle reservations with real-time availability
- 👥 **Guest Management** - Track guest information and booking history
- 💰 **Financial Tracking** - Monitor revenue, expenses, and financial performance
- 📊 **Analytics & Insights** - Performance metrics and business intelligence
- 🔐 **Secure Authentication** - JWT-based user authentication with role-based access
- 💬 **Communications** - Automated messaging and guest communication tools
- 👨‍💼 **Team Management** - Assign tasks and manage team members
- 🔧 **Maintenance Tracking** - Log and track property maintenance issues
- 📍 **Location Management** - Visualize properties on interactive maps

## Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - API requests
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Winston** - Logging
- **Helmet** - Security middleware
- **PM2** - Process management

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Tolulope37/shortstory.git
cd shortstory
```

### 2. Set Up Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your actual values
# Update DATABASE_URL with your PostgreSQL credentials
# Generate a secure JWT_SECRET (at least 64 characters)

# Run database migrations
npm run db:migrate

# (Optional) Seed with sample data
npm run db:seed
```

### 3. Set Up Frontend

```bash
cd backend/frontend

# Install dependencies
npm install
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Backend runs on http://localhost:5001
```

**Terminal 2 - Frontend:**
```bash
cd backend/frontend
npm start
# Frontend runs on http://localhost:3000
```

### Production Mode (with PM2)

**Backend with PM2:**
```bash
cd backend
pm2 start server.js --name "shortlet-backend"
pm2 save
```

**Frontend:**
```bash
cd backend/frontend
npm run build
# Serve the build folder with your preferred web server
```

## Environment Variables

See `backend/.env.example` for all required environment variables.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens (minimum 64 characters)
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Backend server port (default: 5001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)

## Database Setup

### Create Database

```bash
# Access PostgreSQL
psql postgres

# Create database
CREATE DATABASE shortlet_db;

# Create user (if needed)
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE shortlet_db TO your_username;

# Exit
\q
```

### Run Migrations

```bash
cd backend
npm run db:migrate
```

### Reset Database (if needed)

```bash
cd backend
npm run db:reset
```

## Project Structure

```
shortlet/
├── backend/
│   ├── config/           # Configuration files (database, etc.)
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── migrations/       # Database migrations
│   ├── seeders/          # Database seeders
│   ├── utils/            # Utility functions
│   ├── server.js         # Main server file
│   ├── .env.example      # Environment variables template
│   └── frontend/         # React frontend
│       ├── public/       # Static files
│       └── src/
│           ├── components/  # React components
│           ├── pages/       # Page components
│           ├── context/     # React context
│           ├── services/    # API services
│           └── styles/      # CSS files
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

## PM2 Commands

```bash
# List all processes
pm2 list

# View logs
pm2 logs shortlet-backend

# Restart server
pm2 restart shortlet-backend

# Stop server
pm2 stop shortlet-backend

# Remove from PM2
pm2 delete shortlet-backend
```

## Security Features

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Helmet.js for security headers
- ✅ Rate limiting to prevent abuse
- ✅ Input validation with express-validator
- ✅ CORS configuration
- ✅ SQL injection protection via Sequelize ORM
- ✅ Environment variable management
- ✅ Secure password reset flow

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions, please open an issue on GitHub.

## Author

Tolulope

---

**Note**: Never commit `.env` files or sensitive credentials to version control.
