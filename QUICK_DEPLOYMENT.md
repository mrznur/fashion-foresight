# ⚡ Quick Deployment Reference

## 5-Minute Setup Guide

### 1️⃣ Supabase Setup (2 minutes)
```bash
# 1. Create project at https://supabase.com/dashboard
# 2. Copy supabase-schema.sql → SQL Editor → Run
# 3. Get keys from Settings → API:
#    - Project URL
#    - anon public key
```

### 2️⃣ Environment Variables (1 minute)
```bash
# Create .env file
cp .env.example .env

# Add your keys:
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Restart server
npm run dev
```

### 3️⃣ Create Admin User (1 minute)
```bash
# In Supabase Dashboard:
# 1. Authentication → Users → Add User
# 2. Email: admin@fashion-foresight.com
# 3. Password: [your-password]
# 4. Table Editor → profiles → Change role to 'admin'
```

### 4️⃣ Deploy to Vercel (1 minute)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables when prompted:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
```

---

## ✅ Verification Checklist

After deployment, test these:

- [ ] Sign up works
- [ ] Sign in works
- [ ] Products load on shop page
- [ ] Admin dashboard accessible (as admin)
- [ ] Add to cart works
- [ ] Contact form saves to database
- [ ] Newsletter signup saves to database

---

## 🔧 Common Issues & Fixes

### "Demo mode" warning
```bash
# Fix: Add environment variables in hosting platform
# Vercel: Project Settings → Environment Variables
# Netlify: Site Settings → Environment Variables
```

### Products not loading
```sql
-- Fix: Add products via Admin Dashboard or SQL:
INSERT INTO public.products (name, price, image, category, gender, sizes, in_stock, stock_count)
VALUES ('Product Name', 49.00, 'https://image-url.com', 'T-Shirts', 'men', ARRAY['S','M','L'], true, 50);
```

### Admin dashboard not accessible
```sql
-- Fix: Update user role in Supabase:
UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

---

## 📊 Database Tables

Your Supabase database has these tables:

| Table | Purpose |
|-------|---------|
| `profiles` | User accounts & roles |
| `products` | Product catalog |
| `orders` | Customer orders |
| `wishlists` | User wishlists |
| `newsletter_subscribers` | Email list |
| `contact_messages` | Contact form submissions |

---

## 🔐 Security Notes

✅ **Safe to expose:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

❌ **NEVER expose:**
- `service_role` key
- Database password
- Private API keys

---

## 🚀 Deployment Platforms

### Vercel (Recommended)
```bash
vercel
# Follow prompts, add env vars
```

### Netlify
```bash
# Push to GitHub
# Connect repo in Netlify dashboard
# Build: npm run build
# Publish: dist
# Add env vars in settings
```

### Other Platforms
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 18+

---

## 📞 Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Full Guide**: See `DEPLOYMENT_GUIDE.md`
- **Backend Status**: See `BACKEND_INTEGRATION_STATUS.md`
- **Supabase Setup**: See `SUPABASE_SETUP_GUIDE.md`

---

## 🎯 Production Ready When:

- ✅ Database schema deployed
- ✅ Admin user created
- ✅ Products added
- ✅ Environment variables set
- ✅ All features tested
- ✅ Deployed and accessible

---

**You're all set! 🎉**

For detailed instructions, see `DEPLOYMENT_GUIDE.md`
