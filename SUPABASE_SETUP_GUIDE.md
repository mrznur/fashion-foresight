# 🔑 Supabase Keys Setup Guide

## Which Keys to Use?

You need **2 keys** from Supabase:

### ✅ 1. Project URL
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
```
- This is your project's API endpoint
- Format: `https://[project-id].supabase.co`
- **Safe to use in browser** ✅

### ✅ 2. Anon/Public Key
```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- This is the **anon** (anonymous) key
- Also called the **public** key
- **Safe to use in browser** ✅
- Protected by Row Level Security (RLS)
- Very long string starting with `eyJ...`

### ❌ DO NOT USE: Service Role Key
```
❌ NEVER use this in your .env file!
```
- The service role key **bypasses all RLS policies**
- Should **ONLY** be used on the server/backend
- **NEVER expose in browser code** ❌

---

## 📍 Where to Find These Keys

### Step 1: Go to Supabase Dashboard
1. Visit https://supabase.com/dashboard
2. Select your project (or create a new one)

### Step 2: Navigate to Project Settings
1. Click on the **⚙️ Settings** icon (bottom left)
2. Click on **API** in the sidebar

### Step 3: Copy the Keys
You'll see a page like this:

```
┌─────────────────────────────────────────────────┐
│ Project API                                     │
├─────────────────────────────────────────────────┤
│                                                 │
│ Project URL                                     │
│ https://xxxxxxxxxxxxx.supabase.co              │
│ [Copy]                                          │
│                                                 │
│ ─────────────────────────────────────────────  │
│                                                 │
│ Project API keys                                │
│                                                 │
│ anon public                                     │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...       │
│ [Copy] [Reveal]                                 │
│                                                 │
│ service_role secret                             │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...       │
│ [Copy] [Reveal]                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Copy these two:**
1. ✅ **Project URL** (top section)
2. ✅ **anon public** key (middle section)

**DO NOT copy:**
- ❌ **service_role secret** key (bottom section)

---

## 🛠️ Setup Instructions

### Step 1: Create .env File
In your project root, create a `.env` file:

```bash
# Copy .env.example to .env
cp .env.example .env
```

### Step 2: Add Your Keys
Open `.env` and replace the placeholders:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjc4ODg4ODg4LCJleHAiOjE5OTQ0NjQ4ODh9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Restart Dev Server
```bash
# Stop the current server (Ctrl+C)
# Start it again
npm run dev
```

### Step 4: Verify Connection
Open your browser console. You should see:
```
✅ No warning about "demo mode"
```

If you see a warning, check that:
- Keys are correct
- No extra spaces
- File is named `.env` (not `.env.txt`)
- Dev server was restarted

---

## 🔒 Security Notes

### ✅ Safe to Expose (Client-Side)
- `VITE_SUPABASE_URL` - Your project URL
- `VITE_SUPABASE_ANON_KEY` - The anon/public key

**Why?** These are protected by:
1. **Row Level Security (RLS)** - Database policies control access
2. **JWT tokens** - User authentication required for protected data
3. **API rate limiting** - Supabase protects against abuse

### ❌ NEVER Expose (Server-Only)
- `SUPABASE_SERVICE_ROLE_KEY` - Bypasses all security
- Database passwords
- Private API keys

---

## 📋 Quick Checklist

- [ ] Created Supabase project
- [ ] Ran `supabase-schema.sql` in SQL Editor
- [ ] Copied **Project URL** from Settings → API
- [ ] Copied **anon public** key from Settings → API
- [ ] Created `.env` file in project root
- [ ] Pasted both keys into `.env`
- [ ] Restarted dev server
- [ ] Verified no "demo mode" warning in console

---

## 🎯 Example .env File

```env
# ✅ CORRECT - Use these two keys
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY3ODg4ODg4OCwiZXhwIjoxOTk0NDY0ODg4fQ.1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
```

---

## 🆘 Troubleshooting

### "Demo mode" warning still showing
- ✅ Check `.env` file exists in project root
- ✅ Check keys don't have extra spaces
- ✅ Restart dev server completely
- ✅ Clear browser cache

### "Invalid API key" error
- ✅ Make sure you copied the **anon** key, not service_role
- ✅ Check for typos
- ✅ Regenerate keys in Supabase if needed

### "CORS error"
- ✅ Check Project URL is correct
- ✅ Make sure URL includes `https://`
- ✅ Verify project is not paused in Supabase

---

## 🚀 Next Steps After Setup

Once keys are configured:

1. **Test Authentication**
   - Try signing up a new user
   - Check Supabase Dashboard → Authentication → Users

2. **Add Products**
   - Login as admin (`admin@fashion-foresight.com` / `Admin@2026`)
   - Go to Admin Dashboard → Products
   - Add products via the UI

3. **Test Features**
   - Add items to wishlist (saves to Supabase)
   - Submit contact form (saves to Supabase)
   - Subscribe to newsletter (saves to Supabase)

---

## 📞 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **API Settings**: https://supabase.com/dashboard/project/_/settings/api
- **SQL Editor**: https://supabase.com/dashboard/project/_/sql

---

## ✨ Summary

**You need exactly 2 keys:**

1. **Project URL** → `VITE_SUPABASE_URL`
2. **Anon/Public Key** → `VITE_SUPABASE_ANON_KEY`

Both are found in: **Supabase Dashboard → Settings → API**

**DO NOT use the service_role key in your .env file!**
