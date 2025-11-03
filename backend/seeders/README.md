# Database Seeders

This directory contains database seeder files for populating the database with initial/demo data.

## ⚠️ SECURITY WARNING

The seeders in this directory contain **DEMO PASSWORDS** and **TEST DATA**.

### Demo Accounts (from `20250101000000-demo-data.js`)

**Admin Account:**
- Username: `admin`
- Email: `admin@shortlet.com`
- Password: `password123`
- Role: `admin`

**Manager Account:**
- Username: `manager`
- Email: `manager@shortlet.com`
- Password: `manager123`
- Role: `manager`

**Staff Account:**
- Username: `staff`
- Email: `staff@shortlet.com`
- Password: `staff123`
- Role: `staff`

---

## 🚨 IMPORTANT FOR PRODUCTION

### DO NOT use seeders in production with weak passwords!

**Before deploying to production:**

1. **Option 1: Don't seed production database**
   ```bash
   # Only run seeders in development
   NODE_ENV=development npx sequelize-cli db:seed:all
   ```

2. **Option 2: Create production seeders with strong passwords**
   - Create separate seeder files for production
   - Use strong, unique passwords
   - Store credentials securely (password manager)
   - Provide credentials to admins securely (not via email/Slack)

3. **Option 3: Create first admin manually**
   ```bash
   # Use the API to create first admin with strong password
   curl -X POST http://localhost:5001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin",
       "email": "admin@yourdomain.com",
       "password": "use-a-strong-unique-password-here",
       "name": "Admin User",
       "role": "admin"
     }'
   ```

---

## Running Seeders

### Development Environment

```bash
# Run all seeders
npx sequelize-cli db:seed:all

# Run a specific seeder
npx sequelize-cli db:seed --seed 20250101000000-demo-data.js

# Undo all seeders
npx sequelize-cli db:seed:undo:all

# Undo the most recent seeder
npx sequelize-cli db:seed:undo
```

### Production Environment

```bash
# DO NOT run demo seeders in production!
# Create production-specific seeders or manually create accounts
```

---

## Creating New Seeders

```bash
# Generate a new seeder file
npx sequelize-cli seed:generate --name your-seeder-name
```

---

## Best Practices

1. ✅ **Use seeders for:**
   - Initial data (categories, default settings)
   - Development/testing data
   - Demo environments

2. ❌ **Don't use seeders for:**
   - Production user accounts with weak passwords
   - Sensitive/confidential data
   - Customer data

3. 🔒 **Security:**
   - Never commit production passwords to Git
   - Use environment variables for production secrets
   - Rotate default passwords immediately after seeding
   - Monitor for usage of demo accounts in production

4. 📝 **Documentation:**
   - Document all seeded accounts
   - Provide password change instructions
   - List demo data clearly

---

## Current Seeders

### `20250101000000-demo-data.js`

**Purpose:** Create demo users for development and testing

**Contains:**
- 3 user accounts (admin, manager, staff)
- Demo properties (currently disabled - all deleted)

**Status:** Safe for development, NOT for production

**Action Required:** 
- Change all passwords if used in staging/production
- Or delete these accounts and create real ones

---

*Last Updated: November 3, 2025*

