# 🚀 Deployment Guide - Fashion Foresight

## Complete Checklist for Production Deployment

This guide ensures your database, backend, and frontend work perfectly together when deployed.

---

## 📋 Pre-Deployment Checklist

### ✅ 1. Supabase Database Setup

#### Step 1.1: Create Supabase Project
- [ ] Go to https://supabase.com/dashboard
- [ ] Click "New Project"
- [ ] Choose organization and region (closest to your users)
- [ ] Set a strong database password (save it securely!)
- [ ] Wait for project to finish setting up (~2 minutes)

#### Step 1.2: Run Database Schema
- [ ] Open Supabase Dashboard → SQL Editor
- [ ] Copy entire content from `supabase-schema.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run" button
- [ ] Verify success message (no errors)

#### Step 1.3: Verify Tables Created
- [ ] Go to Table Editor in Supabase Dashboard
- [ ] Confirm these tables exist:
  - `profiles`
  - `products`
  - `orders`
  - `wishlists`
  - `newsletter_subscribers`
  - `contact_messages`

#### Step 1.4: Create Admin User
- [ ] Go to Authentication → Users
- [ ] Click "Add User" → "Create new user"
- [ ] Email: `admin@fashion-foresight.com` (or your email)
- [ ] Password: Create a strong password
- [ ] Click "Create user"
- [ ] Go to Table Editor → `profiles`
- [ ] Find your user and change `role` from `user` to `admin`

---

### ✅ 2. Environment Variables Setup

#### Step 2.1: Get Supabase Keys
- [ ] Go to Supabase Dashboard → Settings → API
- [ ] Copy **Project URL** (e.g., `https://xxxxx.supabase.co`)
- [ ] Copy **anon public** key (long string starting with `eyJ...`)
- [ ] ❌ **DO NOT** copy service_role key

#### Step 2.2: Local Development
```bash
# Create .env file in project root
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- [ ] Save `.env` file
- [ ] Restart dev server: `npm run dev`
- [ ] Check browser console - no "demo mode" warning should appear

#### Step 2.3: Production Deployment (Vercel/Netlify)
- [ ] Add environment variables in hosting platform:
  - `VITE_SUPABASE_URL` = your project URL
  - `VITE_SUPABASE_ANON_KEY` = your anon key
- [ ] These are safe to expose (protected by RLS)

---

### ✅ 3. Test Authentication System

#### Step 3.1: Test Sign Up
- [ ] Open your app
- [ ] Click "Sign In" → "Sign Up"
- [ ] Create a test user account
- [ ] Check Supabase Dashboard → Authentication → Users
- [ ] Verify new user appears
- [ ] Check Table Editor → `profiles`
- [ ] Verify profile was auto-created

#### Step 3.2: Test Sign In
- [ ] Sign out
- [ ] Sign in with test credentials
- [ ] Verify you're logged in
- [ ] Check user menu shows correct name

#### Step 3.3: Test Admin Access
- [ ] Sign in as admin user
- [ ] Navigate to `/dashboard`
- [ ] Verify Admin Dashboard loads
- [ ] Check all admin tabs are accessible

---

### ✅ 4. Populate Products Database

You have two options:

#### Option A: Manual Entry via Admin Dashboard (Recommended for initial setup)
- [ ] Sign in as admin
- [ ] Go to Admin Dashboard → Products tab
- [ ] Click "Add Product"
- [ ] Fill in product details:
  - Name, Price, Category, Gender
  - Image URL (use Unsplash or your CDN)
  - Description, Details, Sizes
  - Stock information
- [ ] Click "Add Product"
- [ ] Repeat for all products
- [ ] Verify products appear in shop page

#### Option B: Bulk Import via SQL (Faster for many products)
- [ ] Go to Supabase SQL Editor
- [ ] Run this example (modify with your data):

```sql
INSERT INTO public.products (name, price, image, category, gender, description, sizes, in_stock, stock_count)
VALUES
  ('Classic White T-Shirt', 49.00, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800', 'T-Shirts', 'men', 'Essential white t-shirt', ARRAY['XS','S','M','L','XL','XXL'], true, 50),
  ('Black Essential T-Shirt', 49.00, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800', 'T-Shirts', 'men', 'Timeless black t-shirt', ARRAY['XS','S','M','L','XL','XXL'], true, 45);
-- Add more products...
```

- [ ] Verify products appear in Table Editor
- [ ] Check shop page shows products

---

### ✅ 5. Test Core Features

#### Step 5.1: Product Browsing
- [ ] Visit shop page
- [ ] Verify all products load
- [ ] Test category filters
- [ ] Test gender tabs (Men/Women/Kids)
- [ ] Test price range filters
- [ ] Test sort options
- [ ] Test search functionality

#### Step 5.2: Product Details
- [ ] Click on a product
- [ ] Verify product detail page loads
- [ ] Test size selection
- [ ] Test quantity adjustment
- [ ] Test "Add to Cart" button
- [ ] Test "Add to Wishlist" button

#### Step 5.3: Cart Functionality
- [ ] Add items to cart
- [ ] Open cart drawer
- [ ] Test quantity increase/decrease
- [ ] Test item removal
- [ ] Verify total calculation

#### Step 5.4: Wishlist (if connected to Supabase)
- [ ] Sign in as user
- [ ] Add items to wishlist
- [ ] Go to Dashboard → Wishlist
- [ ] Verify items persist after refresh
- [ ] Test remove from wishlist

#### Step 5.5: Contact Form
- [ ] Go to Contact page
- [ ] Fill out form
- [ ] Submit
- [ ] Check Supabase → `contact_messages` table
- [ ] Verify message was saved

#### Step 5.6: Newsletter
- [ ] Find newsletter form (footer or homepage)
- [ ] Enter email
- [ ] Submit
- [ ] Check Supabase → `newsletter_subscribers` table
- [ ] Verify email was saved

---

### ✅ 6. Admin Dashboard Testing

#### Step 6.1: Products Management
- [ ] Sign in as admin
- [ ] Go to Admin Dashboard → Products
- [ ] Test adding new product
- [ ] Test editing existing product
- [ ] Test deleting product
- [ ] Verify changes reflect in shop page

#### Step 6.2: Orders Management
- [ ] Check Orders tab
- [ ] Verify order list loads
- [ ] Test status updates
- [ ] Test order details view

#### Step 6.3: Customers Management
- [ ] Check Customers tab
- [ ] Verify user list loads
- [ ] Check user details

---

### ✅ 7. Security Verification

#### Step 7.1: Row Level Security (RLS)
- [ ] Sign out
- [ ] Try accessing `/dashboard` → should redirect
- [ ] Sign in as regular user
- [ ] Try accessing admin features → should be blocked
- [ ] Verify only admins can manage products

#### Step 7.2: API Keys
- [ ] Verify `.env` is in `.gitignore`
- [ ] Confirm only anon key is used (not service_role)
- [ ] Check environment variables in hosting platform

#### Step 7.3: CORS & Security Headers
- [ ] Verify Supabase project is not paused
- [ ] Check API requests work from deployed domain
- [ ] Test from different browsers

---

### ✅ 8. Performance Optimization

#### Step 8.1: Images
- [ ] Use optimized image URLs (Unsplash with `?w=800&q=80`)
- [ ] Consider using Supabase Storage or Cloudinary
- [ ] Enable lazy loading (already implemented)

#### Step 8.2: Database Indexes
- [ ] Verify indexes exist (already in schema):
  - `idx_products_category`
  - `idx_products_gender`
  - `idx_orders_user_id`
  - `idx_wishlists_user_id`

#### Step 8.3: Caching
- [ ] Enable caching in hosting platform
- [ ] Set appropriate cache headers

---

### ✅ 9. Build & Deploy

#### Step 9.1: Local Build Test
```bash
# Test production build locally
npm run build

# Preview production build
npm run preview
```

- [ ] Verify build completes without errors
- [ ] Test preview site works correctly
- [ ] Check console for errors

#### Step 9.2: Deploy to Vercel (Recommended)

**Option A: Deploy via Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
# Add environment variables when prompted
```

**Option B: Deploy via GitHub**
- [ ] Push code to GitHub
- [ ] Go to https://vercel.com
- [ ] Click "New Project"
- [ ] Import your GitHub repository
- [ ] Add environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete

#### Step 9.3: Deploy to Netlify (Alternative)
- [ ] Push code to GitHub
- [ ] Go to https://netlify.com
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Connect to GitHub
- [ ] Select repository
- [ ] Build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`
- [ ] Add environment variables
- [ ] Click "Deploy site"

---

### ✅ 10. Post-Deployment Testing

#### Step 10.1: Smoke Tests
- [ ] Visit deployed URL
- [ ] Test all pages load
- [ ] Test authentication works
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test admin dashboard (as admin)

#### Step 10.2: Cross-Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

#### Step 10.3: Mobile Responsiveness
- [ ] Test on actual mobile device
- [ ] Test tablet view
- [ ] Verify all features work on mobile

#### Step 10.4: Performance Check
- [ ] Run Lighthouse audit
- [ ] Check page load times
- [ ] Verify images load properly
- [ ] Test on slow 3G connection

---

## 🔧 Troubleshooting Common Issues

### Issue: "Demo mode" warning in production
**Solution:**
- Verify environment variables are set in hosting platform
- Check variable names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Redeploy after adding variables

### Issue: Authentication not working
**Solution:**
- Check Supabase project is not paused
- Verify anon key is correct
- Check RLS policies are enabled
- Verify `profiles` table has trigger for auto-creation

### Issue: Products not loading
**Solution:**
- Check products exist in Supabase database
- Verify RLS policy allows public read access
- Check browser console for errors
- Verify API requests are successful

### Issue: Admin dashboard not accessible
**Solution:**
- Verify user has `role = 'admin'` in `profiles` table
- Check RLS policies for admin access
- Clear browser cache and cookies
- Try signing out and back in

### Issue: CORS errors
**Solution:**
- Verify Supabase project URL is correct
- Check project is not paused
- Verify domain is allowed in Supabase settings

---

## 📊 Monitoring & Maintenance

### Daily Checks
- [ ] Monitor Supabase dashboard for errors
- [ ] Check authentication logs
- [ ] Review contact form submissions
- [ ] Monitor newsletter subscriptions

### Weekly Checks
- [ ] Review order data
- [ ] Check product inventory
- [ ] Monitor user growth
- [ ] Review error logs

### Monthly Checks
- [ ] Database backup (Supabase auto-backups)
- [ ] Security audit
- [ ] Performance review
- [ ] Update dependencies

---

## 🎯 Production Readiness Checklist

Before going live, ensure:

- [ ] ✅ Database schema is deployed
- [ ] ✅ Admin user is created
- [ ] ✅ Products are populated
- [ ] ✅ Environment variables are set
- [ ] ✅ Authentication works
- [ ] ✅ All features tested
- [ ] ✅ Security verified
- [ ] ✅ Performance optimized
- [ ] ✅ Mobile responsive
- [ ] ✅ Cross-browser tested
- [ ] ✅ Error tracking setup (optional: Sentry)
- [ ] ✅ Analytics setup (optional: Google Analytics)
- [ ] ✅ Domain configured
- [ ] ✅ SSL certificate active

---

## 🚀 You're Ready to Launch!

Once all checkboxes are complete, your Fashion Foresight store is production-ready!

### Next Steps:
1. **Announce Launch** - Share with your audience
2. **Monitor Performance** - Watch for any issues
3. **Gather Feedback** - Listen to user feedback
4. **Iterate** - Continuously improve

### Optional Enhancements:
- [ ] Add payment gateway (Stripe/PayPal)
- [ ] Implement email notifications (SendGrid/Mailgun)
- [ ] Add image CDN (Cloudinary)
- [ ] Setup error tracking (Sentry)
- [ ] Add analytics (Google Analytics/Mixpanel)
- [ ] Implement SEO optimizations
- [ ] Add sitemap.xml
- [ ] Setup robots.txt

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **React Router**: https://reactrouter.com
- **Vite**: https://vitejs.dev

---

## 🎉 Congratulations!

Your Fashion Foresight e-commerce platform is now live and fully functional with:
- ✅ Secure authentication
- ✅ Product management
- ✅ Shopping cart
- ✅ Wishlist
- ✅ Admin dashboard
- ✅ Contact forms
- ✅ Newsletter subscriptions

Happy selling! 🛍️
