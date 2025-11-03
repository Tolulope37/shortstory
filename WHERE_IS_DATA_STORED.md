# 🗄️ Where Is Your Data Stored? (Simple Explanation)

## 📍 **Physical Location on Your Mac**

All your user data is stored in **PostgreSQL database files** on your computer:

```
Location: /usr/local/var/postgres/

Inside this folder:
├── base/                    ← All your database data lives here
│   └── [database_id]/
│       ├── [table_files]    ← Your Users, Properties, Bookings, etc.
│       └── ...
├── global/                  ← Database system files
└── pg_wal/                  ← Transaction logs (backup/recovery)
```

**In simple terms:**
- It's like a filing cabinet on your computer
- Located at: `/usr/local/var/postgres/`
- You can't open these files directly (they're in a special format)
- You access them through PostgreSQL (the database program)

---

## 🗂️ **What's Inside? (Your Database Structure)**

Your database is called: **`shortlet_db`**

### **Tables (Think of these as spreadsheets):**

1. **Users** - All user accounts
2. **Properties** - All your rental properties
3. **Bookings** - All reservations
4. **Guests** - All guest information

---

## 👥 **Users Table - Where Usernames & Passwords Live**

### **What's Stored:**

| Column Name | What It Is | Example |
|------------|------------|---------|
| `id` | Unique ID (like a fingerprint) | `550e8400-e29b-41d4-a716-446655440000` |
| `username` | Login username | `admin` |
| `email` | Email address | `admin@example.com` |
| `password` | Encrypted password | `$2a$10$xyz...abc` (scrambled!) |
| `name` | Full name | `John Doe` |
| `role` | User type | `admin`, `manager`, or `staff` |
| `phone` | Phone number | `+234 123 456 7890` |
| `isActive` | Account enabled? | `true` or `false` |
| `lastLogin` | Last login time | `2025-01-03 18:30:00` |
| `resetPasswordToken` | Reset token (when resetting password) | `$2a$10$abc...` or `null` |
| `resetPasswordExpire` | When reset token expires | `2025-01-03 19:30:00` or `null` |
| `createdAt` | When account was created | `2025-01-03 12:00:00` |
| `updatedAt` | Last time account was updated | `2025-01-03 18:30:00` |

---

## 🔍 **How to View Your Data**

### **Method 1: Using Terminal (Command Line)**

```bash
# Connect to your database
psql -U tolulopearobieke -d shortlet_db

# View all users
SELECT username, email, name, role FROM "Users";

# View specific user
SELECT * FROM "Users" WHERE username = 'admin';

# Exit
\q
```

### **Method 2: Using a GUI Tool (Recommended for Non-Technical)**

**Install a database viewer:**
- **Postico** (Mac) - FREE, beautiful: https://eggerapps.at/postico/
- **pgAdmin** (Free, all platforms): https://www.pgadmin.org/
- **TablePlus** (Mac/Windows) - FREE trial: https://tableplus.com/

**Connection Details:**
```
Host: localhost
Port: 5432
Database: shortlet_db
Username: tolulopearobieke
Password: (leave blank - no password set)
```

---

## 📊 **Visual Representation**

```
Your Mac
└── /usr/local/var/postgres/          ← PostgreSQL Folder
    └── shortlet_db                    ← Your Database
        ├── Users Table                ← User Accounts Stored Here
        │   ├── admin                  (username: admin, email: admin@example.com)
        │   ├── manager                (username: manager, email: manager@example.com)
        │   └── [any new signups]      (when someone signs up)
        │
        ├── Properties Table           ← Your Rental Properties
        │   ├── Lekki Paradise Villa
        │   ├── Ikeja GRA Apartment
        │   └── Victoria Island Suite
        │
        ├── Bookings Table             ← Reservations
        │   └── (when guests book properties)
        │
        └── Guests Table               ← Guest Information
            └── (guest contact details)
```

---

## 🔄 **What Happens When Someone Signs Up**

### **Real-World Flow:**

```
1. User fills signup form:
   - Username: sarah123
   - Email: sarah@gmail.com
   - Password: MyPassword123

2. Your app sends to backend
   
3. Backend processes:
   ├─ Password "MyPassword123" → Encrypted to "$2a$10$abc...xyz"
   └─ Generates unique ID: "550e8400-e29b-41d4-a716-446655440000"

4. Backend saves to PostgreSQL database:
   INSERT INTO "Users" (
     id, username, email, password, name, role, createdAt
   ) VALUES (
     '550e8400-e29b-41d4-a716-446655440000',
     'sarah123',
     'sarah@gmail.com',
     '$2a$10$abc...xyz',
     'Sarah Smith',
     'staff',
     '2025-01-03 18:45:00'
   )

5. Data is now PERMANENTLY stored at:
   /usr/local/var/postgres/base/[database_id]/[table_file]

6. Even if you:
   ✅ Restart your computer → Data is still there
   ✅ Close the browser → Data is still there
   ✅ Restart the server → Data is still there
   ✅ Come back in 5 years → Data is still there!
```

---

## 🔐 **Security: How Passwords Are Protected**

### **What You CAN'T See (Even if you access the database):**

```bash
# If you look at the database directly:
psql -U tolulopearobieke -d shortlet_db -c "SELECT password FROM \"Users\" WHERE username = 'admin';"

# You'll see:
$2a$10$xyz...abc

# NOT the real password!
```

### **Why You Can't See Real Passwords:**

```
Real Password:        "password123"
                            ↓
Bcrypt Encryption:    [complex math algorithm]
                            ↓
Stored in Database:   "$2a$10$N9qo.8uLOmIjcMj1pPVQue..."

• This process is ONE-WAY only
• You CANNOT reverse it
• Even database admins can't see real passwords
• Only way to check: User enters password → System encrypts it → Compares
```

**Think of it like:**
- You give someone a recipe to bake a cake
- They can make the cake
- But they CAN'T reverse-engineer the recipe from the cake
- That's what bcrypt does to passwords!

---

## 📱 **Where Is Data When User Is Logged In?**

### **Two Places:**

#### **1. Database (Permanent Storage)**
```
Location: /usr/local/var/postgres/
Contains: ALL user data (username, email, password, etc.)
Persists: Forever (until you delete it)
```

#### **2. Browser (Temporary Storage)**
```
Location: Browser's localStorage
Contains: 
  - JWT Token (like a VIP pass): "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  - User info: { name: "John Doe", email: "john@example.com", role: "admin" }
Persists: Until user logs out or clears browser data
```

**When user visits your app:**
```
1. Browser checks: "Do I have a token?"
2. If yes → Send token to backend
3. Backend checks: "Is this token valid?"
4. If valid → Get user data from DATABASE
5. Show user their dashboard
```

---

## 🗂️ **Example: Your Actual Current Data**

### **Users Currently in Database:**

```
admin
├─ Email: admin@example.com
├─ Password: $2a$10$... (encrypted "password123")
├─ Role: admin
└─ Created: [date you ran seed]

manager
├─ Email: manager@example.com
├─ Password: $2a$10$... (encrypted "manager123")
├─ Role: manager
└─ Created: [date you ran seed]
```

### **If Sarah signs up:**

```
sarah123
├─ Email: sarah@gmail.com
├─ Password: $2a$10$... (encrypted "MyPassword123")
├─ Role: staff
└─ Created: 2025-01-03 18:45:00

↓ Gets added to database ↓

Database now has:
1. admin
2. manager
3. sarah123 ← NEW!
```

---

## 💾 **Backup & Safety**

### **Your Data Is Safe Because:**

1. **Stored on your hard drive**
   - Physical location: `/usr/local/var/postgres/`
   - Protected by macOS file permissions

2. **PostgreSQL manages it**
   - Handles crashes gracefully
   - Transaction logs for recovery
   - Data integrity checks

3. **Passwords are encrypted**
   - Even if someone steals database file
   - They can't read the passwords

### **Recommended: Backup Your Database**

```bash
# Create backup (run this monthly)
pg_dump -U tolulopearobieke shortlet_db > backup_2025_01_03.sql

# Restore if needed
psql -U tolulopearobieke -d shortlet_db < backup_2025_01_03.sql
```

---

## 🎯 **Summary: Where Is Everything?**

| Data Type | Storage Location | Format | Permanent? |
|-----------|-----------------|---------|-----------|
| **Usernames** | PostgreSQL Database | Plain text | ✅ Yes |
| **Emails** | PostgreSQL Database | Plain text | ✅ Yes |
| **Passwords** | PostgreSQL Database | Encrypted | ✅ Yes |
| **User Names** | PostgreSQL Database | Plain text | ✅ Yes |
| **Roles** | PostgreSQL Database | Plain text | ✅ Yes |
| **Properties** | PostgreSQL Database | Plain text | ✅ Yes |
| **Bookings** | PostgreSQL Database | Plain text | ✅ Yes |
| **Login Token** | User's Browser | JWT string | ❌ No (cleared on logout) |

---

## 🔍 **Want to See Your Data Right Now?**

### **Quick Look:**

```bash
# See all users
psql -U tolulopearobieke -d shortlet_db -c "SELECT username, email, role FROM \"Users\";"

# See all properties
psql -U tolulopearobieke -d shortlet_db -c "SELECT name, city, \"baseRate\" FROM \"Properties\";"

# Count total users
psql -U tolulopearobieke -d shortlet_db -c "SELECT COUNT(*) FROM \"Users\";"
```

---

**In the simplest terms:**
- Your user data lives in a special folder on your Mac: `/usr/local/var/postgres/`
- It's managed by PostgreSQL (database software)
- Passwords are scrambled so nobody can read them
- Data stays there permanently until you delete it
- You can view it using database tools or terminal commands

**It's like a digital filing cabinet that never loses papers!** 📁✨

