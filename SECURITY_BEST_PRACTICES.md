# 🔒 Security Best Practices

This document outlines security best practices for the ShortStories Property Management Platform.

---

## Table of Contents

1. [Environment Variables](#environment-variables)
2. [Authentication & Authorization](#authentication--authorization)
3. [API Keys & Secrets](#api-keys--secrets)
4. [Database Security](#database-security)
5. [Frontend Security](#frontend-security)
6. [Deployment Security](#deployment-security)
7. [Security Checklist](#security-checklist)

---

## Environment Variables

### ✅ DO:

1. **Use `.env` files for all sensitive configuration**
   ```env
   JWT_SECRET=your-super-secret-key
   DATABASE_URL=postgresql://user:pass@localhost/db
   ```

2. **Keep `.env` files out of version control**
   - ✅ `.env` is in `.gitignore`
   - ✅ Commit `.env.example` with dummy values
   - ❌ NEVER commit `.env`, `.env.local`, or `.env.production`

3. **Use different values for each environment**
   - Development: Weak secrets are okay
   - Staging: Use production-like secrets
   - Production: Strong, unique secrets

4. **Generate strong secrets**
   ```bash
   # Generate a secure JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

### ❌ DON'T:

- ❌ Hardcode secrets in source code
- ❌ Use weak or default secrets in production
- ❌ Share `.env` files via email, Slack, or chat
- ❌ Commit `.env` files to Git

---

## Authentication & Authorization

### JWT Security

1. **Strong JWT Secrets**
   - Minimum 64 characters
   - Use cryptographically random strings
   - Rotate periodically (every 90 days in production)

2. **Token Expiration**
   ```env
   JWT_EXPIRE=15m        # Short-lived access tokens
   JWT_REFRESH_EXPIRE=7d # Longer-lived refresh tokens
   ```

3. **Secure Token Storage**
   - ✅ Frontend: Use `localStorage` or `httpOnly` cookies
   - ✅ Backend: Never log tokens
   - ❌ Don't include tokens in URLs
   - ❌ Don't store tokens in plain text

4. **Password Requirements**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - Optional: Special characters

5. **Password Hashing**
   ```javascript
   const bcrypt = require('bcryptjs');
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password, salt);
   ```
   - ✅ Use bcrypt with cost factor 10+
   - ❌ NEVER store passwords in plain text
   - ❌ NEVER hash passwords on frontend

### Authorization

1. **Check user ownership**
   ```javascript
   // Verify user owns the resource
   if (property.userId !== req.user.id) {
     return res.status(403).json({ message: 'Unauthorized' });
   }
   ```

2. **Role-based access control (RBAC)**
   ```javascript
   const authorize = (...roles) => {
     return (req, res, next) => {
       if (!roles.includes(req.user.role)) {
         return res.status(403).json({ message: 'Forbidden' });
       }
       next();
     };
   };
   ```

---

## API Keys & Secrets

### Google Maps API Key

1. **Add Restrictions**
   - **HTTP Referrer Restrictions:**
     - `http://localhost:3000/*` (development)
     - `https://yourdomain.com/*` (production)
   
   - **API Restrictions:**
     - Enable only: Maps JavaScript API, Maps Embed API, Geocoding API
     - Disable all others

2. **Use Environment Variables**
   ```javascript
   // ❌ BAD:
   const apiKey = "AIzaSyBacndSAxf8mC6K8lwEjNgvD_fumxAghn0";
   
   // ✅ GOOD:
   const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
   ```

3. **Monitor Usage**
   - Set up billing alerts ($10, $50, $100)
   - Review usage weekly
   - Check for suspicious activity

4. **Regenerate Compromised Keys**
   - If exposed, regenerate immediately
   - Update all deployment environments
   - Monitor for abuse for 7 days

### Payment API Keys

1. **Stripe/Paystack Keys**
   - ✅ Use test keys in development
   - ✅ Use live keys only in production
   - ✅ Store secret keys in backend `.env`
   - ✅ Store publishable keys in frontend `.env.local`
   - ❌ NEVER expose secret keys to frontend

2. **Webhook Secrets**
   ```javascript
   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
   const sig = req.headers['stripe-signature'];
   const event = stripe.webhooks.constructEvent(
     req.body,
     sig,
     process.env.STRIPE_WEBHOOK_SECRET
   );
   ```

---

## Database Security

### Connection Security

1. **Use Environment Variables**
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/database
   ```

2. **SSL in Production**
   ```env
   DATABASE_SSL=true
   ```

3. **Principle of Least Privilege**
   - Create database users with minimal permissions
   - Don't use superuser accounts for app connections

### Query Security

1. **Use Parameterized Queries (Sequelize ORM)**
   ```javascript
   // ✅ GOOD (SQL injection safe):
   const user = await User.findOne({ where: { email } });
   
   // ❌ BAD (vulnerable to SQL injection):
   await sequelize.query(`SELECT * FROM users WHERE email = '${email}'`);
   ```

2. **Input Validation**
   ```javascript
   const { body } = require('express-validator');
   
   body('email').isEmail().normalizeEmail(),
   body('password').isLength({ min: 8 })
   ```

### Data Protection

1. **Sensitive Data**
   - Hash passwords (bcrypt)
   - Exclude sensitive fields from API responses
   ```javascript
   User.prototype.toJSON = function() {
     const values = { ...this.get() };
     delete values.password;
     delete values.resetPasswordToken;
     return values;
   };
   ```

2. **Database Backups**
   - Automated daily backups
   - Encrypted backups
   - Test restore procedures monthly

---

## Frontend Security

### 1. Never Trust User Input

```javascript
// ✅ GOOD: Validate and sanitize
const sanitizedInput = DOMPurify.sanitize(userInput);

// ❌ BAD: Direct HTML injection
element.innerHTML = userInput;
```

### 2. XSS Prevention

- React automatically escapes values
- Be careful with `dangerouslySetInnerHTML`
- Use Content Security Policy (CSP) headers

### 3. CORS Configuration

```javascript
// Backend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### 4. Don't Store Secrets in Frontend

```javascript
// ❌ BAD: Secret keys visible in browser
const apiSecret = 'sk_live_abc123...';

// ✅ GOOD: Only use public keys
const publicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
```

---

## Deployment Security

### 1. HTTPS Everywhere

- ✅ Use HTTPS in production (SSL/TLS certificates)
- ✅ Redirect HTTP to HTTPS
- ✅ Use HSTS headers
- ❌ NEVER send credentials over HTTP

### 2. Security Headers

```javascript
const helmet = require('helmet');
app.use(helmet());
```

Adds headers:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security`
- And more

### 3. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. Environment-Specific Settings

```env
# Development
NODE_ENV=development
LOG_LEVEL=debug

# Production
NODE_ENV=production
LOG_LEVEL=error
```

### 5. Dependency Security

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies regularly
npm update
```

---

## Security Checklist

### Before Committing Code

- [ ] No hardcoded secrets or API keys
- [ ] `.env` files are in `.gitignore`
- [ ] Passwords are hashed, never stored in plain text
- [ ] SQL queries use parameterized statements
- [ ] User input is validated and sanitized
- [ ] Sensitive data is excluded from API responses

### Before Deploying

- [ ] All environment variables are set
- [ ] Strong, unique JWT secret is configured
- [ ] Database uses SSL in production
- [ ] HTTPS is enabled
- [ ] Security headers are configured (Helmet)
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured
- [ ] API keys have restrictions applied
- [ ] Billing alerts are set up
- [ ] Error messages don't leak sensitive info
- [ ] Logging doesn't include passwords/tokens
- [ ] Dependencies are up to date (`npm audit`)

### Production Monitoring

- [ ] Set up application monitoring (Sentry, New Relic)
- [ ] Monitor API usage and costs
- [ ] Review logs for suspicious activity
- [ ] Set up uptime monitoring
- [ ] Configure automated backups
- [ ] Test disaster recovery procedures
- [ ] Review security monthly

---

## Incident Response

### If a Secret is Compromised:

1. **Immediately regenerate** the compromised secret
2. **Update** all deployment environments
3. **Monitor** for unusual activity
4. **Review logs** for unauthorized access
5. **Document** the incident
6. **Post-mortem**: How did it happen? How to prevent?

### If a Breach Occurs:

1. **Contain**: Disable compromised accounts/keys
2. **Assess**: What data was accessed?
3. **Notify**: Users, stakeholders, authorities (if required)
4. **Remediate**: Fix vulnerabilities
5. **Monitor**: Watch for further attempts
6. **Learn**: Update security procedures

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [React Security](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

## Questions?

If you discover a security vulnerability, please email: security@yourdomain.com

**Remember: Security is not a one-time task, it's an ongoing process.**

---

*Last Updated: November 3, 2025*

