# Production Setup Guide

This guide will help you deploy your Shortlet Management System to production.

## ✅ Completed Features

1. **PostgreSQL Database** with Sequelize ORM
2. **Real JWT Authentication** with bcrypt password hashing
3. **Security Measures**: Helmet, rate limiting, input validation
4. **Winston Logging** with file and console outputs
5. **Booking Calendar System** with availability checking
6. **Docker & Docker Compose** for containerization

## 🚀 Quick Start - Local Development

### Prerequisites
- Node.js >= 16
- PostgreSQL >= 12
- npm >= 8

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://shortlet:shortlet123@localhost:5432/shortlet_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=30d

# Logging
LOG_LEVEL=info
ENABLE_FILE_LOGGING=false

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Setup PostgreSQL Database

#### Option A: Local PostgreSQL

```bash
# Create database
createdb shortlet_db

# Or using psql
psql -U postgres
CREATE DATABASE shortlet_db;
CREATE USER shortlet WITH PASSWORD 'shortlet123';
GRANT ALL PRIVILEGES ON DATABASE shortlet_db TO shortlet;
```

#### Option B: Docker PostgreSQL

```bash
docker run --name shortlet-postgres \
  -e POSTGRES_DB=shortlet_db \
  -e POSTGRES_USER=shortlet \
  -e POSTGRES_PASSWORD=shortlet123 \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 4. Run Migrations and Seeds

```bash
# Run database migrations
npm run db:migrate

# Seed initial data (admin user + sample properties)
npm run db:seed
```

### 5. Start Development Server

```bash
# Start backend (with hot reload)
npm run server

# Or without nodemon
npm start
```

The API will be available at `http://localhost:5000`

### 6. Test the API

```bash
# Health check
curl http://localhost:5000/api/health

# Login with default admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

This will start both PostgreSQL and the backend API:

```bash
cd backend

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

### Manual Docker Build

```bash
# Build image
docker build -t shortlet-backend .

# Run container
docker run -d \
  -p 5000:5000 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=your-secret \
  --name shortlet-api \
  shortlet-backend
```

## 🌍 Production Deployment

### Option 1: Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create your-shortlet-app

# Add PostgreSQL
heroku addons:create heroku-postgresql:essential-0

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-secret
heroku config:set FRONTEND_URL=https://your-frontend-domain.com

# Deploy
git push heroku main

# Run migrations
heroku run npm run db:migrate

# Seed data
heroku run npm run db:seed
```

### Option 2: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Add new service from GitHub repo
5. Set environment variables in Railway dashboard
6. Deploy automatically on push

### Option 3: DigitalOcean App Platform

1. Create new app from GitHub
2. Add managed PostgreSQL database
3. Set environment variables
4. Auto-deploy on push

### Option 4: AWS (EC2 + RDS)

#### Setup RDS PostgreSQL
1. Create RDS PostgreSQL instance
2. Configure security groups
3. Note connection string

#### Setup EC2
```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone your-repo
cd shortlet/backend

# Install dependencies
npm install --production

# Create .env file with production values
nano .env

# Run migrations
npm run db:migrate

# Start with PM2
pm2 start server.js --name shortlet-api
pm2 startup
pm2 save

# Setup Nginx reverse proxy
sudo apt install nginx
# Configure Nginx (see below)
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔐 Security Checklist for Production

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (32+ random characters)
- [ ] Enable HTTPS/SSL
- [ ] Set NODE_ENV=production
- [ ] Configure CORS with specific origins
- [ ] Enable database SSL
- [ ] Set up regular database backups
- [ ] Configure firewall rules
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Review rate limiting settings
- [ ] Enable application logging
- [ ] Set up log rotation

## 📊 Monitoring & Logs

### View Logs (Docker)
```bash
docker-compose logs -f backend
```

### View Logs (PM2)
```bash
pm2 logs shortlet-api
```

### Log Files
Production logs are saved in `/app/logs/`:
- `error.log` - Error logs only
- `combined.log` - All logs

## 🔄 Database Management

### Backup Database
```bash
# Local
pg_dump shortlet_db > backup.sql

# Docker
docker exec shortlet-postgres pg_dump -U shortlet shortlet_db > backup.sql

# Heroku
heroku pg:backups:capture
heroku pg:backups:download
```

### Restore Database
```bash
# Local
psql shortlet_db < backup.sql

# Docker
docker exec -i shortlet-postgres psql -U shortlet shortlet_db < backup.sql
```

### Reset Database (Development Only)
```bash
npm run db:reset
```

## 🧪 Testing API Endpoints

### Authentication
```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

### Properties
```bash
# Get all properties
curl http://localhost:5000/api/properties

# Get single property
curl http://localhost:5000/api/properties/{id}

# Create property (requires auth)
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test Property","location":"Lagos","city":"Lagos","state":"Lagos","baseRate":50000}'
```

### Bookings
```bash
# Check availability
curl "http://localhost:5000/api/properties/{id}/availability?checkIn=2025-02-01&checkOut=2025-02-05"

# Create booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId":"property-uuid",
    "guestName":"John Doe",
    "guestEmail":"john@example.com",
    "guestPhone":"+2348012345678",
    "checkIn":"2025-02-01",
    "checkOut":"2025-02-05",
    "numberOfGuests":2
  }'
```

## 📝 Default Credentials

**Admin User:**
- Username: `admin`
- Password: `password123`
- Email: `admin@shortlet.com`

**Manager User:**
- Username: `manager`
- Password: `manager123`
- Email: `manager@shortlet.com`

⚠️ **IMPORTANT:** Change these passwords immediately in production!

## 🆘 Troubleshooting

### Database Connection Issues
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Verify network connectivity
- Check firewall rules

### JWT Token Issues
- Verify JWT_SECRET is set
- Check token expiration
- Ensure Authorization header format: `Bearer TOKEN`

### Migration Issues
```bash
# Check migration status
npx sequelize-cli db:migrate:status

# Undo last migration
npx sequelize-cli db:migrate:undo

# Undo all migrations
npx sequelize-cli db:migrate:undo:all
```

## 📚 Next Steps

1. **Payment Integration**: Add Paystack/Flutterwave
2. **Email Service**: Configure SendGrid/Mailgun
3. **SMS Service**: Setup Twilio
4. **File Upload**: Configure Cloudinary/AWS S3
5. **Analytics**: Add Google Analytics
6. **Error Tracking**: Setup Sentry

## 🔗 Useful Links

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [JWT.io](https://jwt.io/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)

---

Need help? Contact your development team or check the project repository issues.

