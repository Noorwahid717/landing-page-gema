# Vercel Deployment Troubleshooting - GEMA Landing Page

## ❌ Common Issue: "Server error - Configuration" 

### Problem
NextAuth configuration error karena environment variables tidak di-set di Vercel production.

### ✅ Solution

#### Option 1: Via Vercel Dashboard (Recommended)

1. **Login ke Vercel Dashboard:**
   - Kunjungi: https://vercel.com/dashboard
   - Pilih project: `landing-page-gema`

2. **Tambah Environment Variables:**
   - Go to: Settings → Environment Variables
   - Add the following variables untuk **Production**:

```bash
# CRITICAL - NextAuth Configuration
NEXTAUTH_URL=https://landing-page-gema.vercel.app
NEXTAUTH_SECRET=gema-sma-wahidiyah-super-secret-production-key-2025-kediri

# Database
DATABASE_URL=file:./prod.db

# Admin Credentials  
ADMIN_EMAIL=admin@smawahidiyah.edu
ADMIN_PASSWORD=GemaWahidiyah2025!

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://landing-page-gema.vercel.app
NEXT_PUBLIC_SITE_NAME=GEMA - Generasi Muda Informatika | SMA Wahidiyah Kediri
NEXT_PUBLIC_CONTACT_EMAIL=smaswahidiyah@gmail.com
NEXT_PUBLIC_SCHOOL_NAME=SMA Wahidiyah Kediri
NEXT_PUBLIC_REGISTRATION_URL=https://spmbkedunglo.com
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/smawahidiyah_official
```

3. **Redeploy:**
   - Klik "Redeploy" di dashboard
   - Atau push commit baru ke GitHub

#### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Add environment variables
bash setup-vercel-env.sh

# Redeploy
vercel --prod
```

### 🔍 Testing After Fix

1. **Test NextAuth:**
   ```
   https://landing-page-gema.vercel.app/api/auth/signin
   ```

2. **Test Admin Login:**
   ```  
   https://landing-page-gema.vercel.app/admin/login
   Email: admin@smawahidiyah.edu
   Password: GemaWahidiyah2025!
   ```

3. **Test Debug Session:**
   ```
   https://landing-page-gema.vercel.app/api/debug-session
   ```

### 🛠️ Database Notice

**Important:** SQLite (`file:./prod.db`) tidak bekerja di Vercel production karena filesystem read-only.

**Untuk production yang proper, gunakan:**
- **Vercel Postgres** (recommended)
- **PlanetScale** (MySQL)
- **Supabase** (PostgreSQL)
- **Railway** (PostgreSQL)

### 📝 Environment Variables Checklist

- [x] NEXTAUTH_URL - Production domain URL  
- [x] NEXTAUTH_SECRET - Strong random string
- [x] DATABASE_URL - Database connection string
- [x] ADMIN_EMAIL - Admin login email
- [x] ADMIN_PASSWORD - Admin login password
- [x] NEXT_PUBLIC_* - Public configuration variables

### 🚨 Security Notes

1. **NEXTAUTH_SECRET** harus unique dan strong (32+ characters)
2. **ADMIN_PASSWORD** harus strong untuk production
3. Jangan commit file `.env.production` ke git
4. Gunakan Vercel environment variables untuk secrets

---

**Status:** ✅ Ready for deployment with proper environment configuration