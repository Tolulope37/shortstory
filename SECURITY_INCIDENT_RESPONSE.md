# 🚨 SECURITY INCIDENT RESPONSE - Google Maps API Key Exposure

**Date:** November 3, 2025  
**Severity:** HIGH  
**Status:** IMMEDIATE ACTION REQUIRED

---

## What Happened

Your Google Maps API key `AIzaSyBacndSAxf8mC6K8lwEjNgvD_fumxAghn0` was accidentally committed to your public GitHub repository.

**Exposed in files:**
- `backend/frontend/src/pages/LocationsPage.jsx` (line 297)
- `backend/frontend/src/components/PropertyMap.jsx` (line 21)

**Public since:** November 3, 2025 (commit `cce5d07`)

---

## Immediate Actions (Do Within 1 Hour)

### Step 1: Regenerate Your Google Maps API Key

1. **Go to Google Cloud Console:**
   - https://console.cloud.google.com/apis/credentials

2. **Select your project:**
   - Project: `ilemi-maps`

3. **Find the exposed key:**
   - Look for: `AIzaSyBacndSAxf8mC6K8lwEjNgvD_fumxAghn0`

4. **Regenerate the key:**
   - Click on the key name
   - Click the "REGENERATE KEY" button
   - Copy the new key immediately
   - Save it somewhere safe (password manager)

5. **Delete the old key:**
   - Ensure the old key is deactivated
   - This prevents further abuse

---

### Step 2: Add New Key to Your Local Environment

1. **Create `.env.local` file:**
   ```bash
   cd /Users/tolulopearobieke/Desktop/Shortlet/backend/frontend
   touch .env.local
   ```

2. **Add your NEW key:**
   ```env
   REACT_APP_GOOGLE_MAPS_API_KEY=your-new-regenerated-key-here
   REACT_APP_API_URL=http://localhost:5001/api
   ```

3. **Verify `.gitignore` excludes this:**
   - `.env.local` should already be in `.gitignore`
   - NEVER commit this file

---

### Step 3: Add API Restrictions (Prevent Future Abuse)

**In Google Cloud Console > Credentials:**

#### Application Restrictions:
1. Select "HTTP referrers (web sites)"
2. Add these patterns:
   ```
   http://localhost:3000/*
   http://localhost:3005/*
   https://yourdomain.com/*
   https://*.yourdomain.com/*
   ```

#### API Restrictions:
1. Select "Restrict key"
2. Enable only these APIs:
   - ✅ Maps JavaScript API
   - ✅ Maps Embed API  
   - ✅ Geocoding API
   - ✅ Places API (if needed)
   - ❌ All others (uncheck)

---

### Step 4: Monitor for Abuse

1. **Check billing immediately:**
   - https://console.cloud.google.com/billing

2. **Review API usage:**
   - Look for unexpected spikes
   - Check for requests from unknown IPs/domains

3. **Set up billing alerts:**
   - Set threshold: e.g., $10, $50, $100
   - Add your email for notifications

4. **Review quotas:**
   - https://console.cloud.google.com/apis/api/maps-backend.googleapis.com/quotas

---

## What We Already Fixed

✅ **Removed hardcoded key from source code**
   - Updated `LocationsPage.jsx`
   - Updated `PropertyMap.jsx`

✅ **Moved to environment variables**
   - Now using `process.env.REACT_APP_GOOGLE_MAPS_API_KEY`

✅ **Created `.env.example`**
   - Template for other developers

✅ **Pushed fix to GitHub**
   - New code is secure

---

## Still At Risk

⚠️ **Git History:**
   - Old commits still contain the exposed key
   - Anyone with access to repository can see it in history
   - Commit: `cce5d07`

⚠️ **Google's Bots:**
   - They've already detected and flagged it
   - Email sent to notify you

⚠️ **Potential Abuse:**
   - Key could be used for unauthorized requests
   - Could result in unexpected charges

---

## Long-Term Prevention

### 1. Use Environment Variables for ALL secrets:
```javascript
// ❌ NEVER DO THIS:
const apiKey = "AIzaSyBacndSAxf8mC6K8lwEjNgvD_fumxAghn0";

// ✅ ALWAYS DO THIS:
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
```

### 2. Review files before committing:
```bash
# Always check what you're committing
git diff
git status

# Look for API keys, passwords, tokens
grep -r "AIza" .
grep -r "sk-" .
grep -r "password" .
```

### 3. Use `.env` files correctly:
- ✅ `.env.example` - Template (safe to commit)
- ❌ `.env` - Actual values (NEVER commit)
- ❌ `.env.local` - Local overrides (NEVER commit)
- ❌ `.env.production` - Production values (NEVER commit)

### 4. Use git hooks:
Install tools like:
- `git-secrets` - Prevents committing secrets
- `detect-secrets` - Scans for secrets
- `truffleHog` - Finds secrets in git history

### 5. Use secret scanning:
- Enable GitHub Secret Scanning (if available)
- Use services like GitGuardian
- Regular security audits

---

## Checklist

Complete these tasks immediately:

- [ ] Regenerated Google Maps API key
- [ ] Deleted old exposed key
- [ ] Created `backend/frontend/.env.local`
- [ ] Added new key to `.env.local`
- [ ] Added HTTP referrer restrictions
- [ ] Added API restrictions
- [ ] Checked billing for abuse
- [ ] Set up billing alerts
- [ ] Restarted frontend server with new key
- [ ] Tested maps functionality still works
- [ ] Reviewed other files for secrets

---

## Questions?

If you need help:
1. Check Google Cloud Console documentation
2. Review Google Maps API security best practices
3. Contact Google Cloud Support if you see unauthorized usage

---

## Summary

**What happened:** API key exposed in public GitHub repository  
**Risk level:** HIGH - Anyone can use your key and rack up charges  
**Action:** Regenerate key immediately, add restrictions  
**Time frame:** Do this within 1 hour  

**The fix is already in your code, but you MUST regenerate the key to be safe.**

---

*Created: November 3, 2025*  
*Last Updated: November 3, 2025*

