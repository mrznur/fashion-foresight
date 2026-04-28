# SARTORIAL - Luxury Men's Fashion E-Commerce

A modern, responsive men's fashion e-commerce website built with React, TypeScript, Tailwind CSS, and React Router.

## Features

### 🔐 Authentication System
- **User Login/Signup**: Create accounts and sign in
- **Admin Login**: Separate admin access with dashboard
- **Demo Credentials**:
  - Admin: `admin@elegance.com` / `admin123`
  - User: Create your own account or use any registered email

### 👔 Men's Fashion Focus
- Premium suits and blazers
- Casual wear collection
- Accessories and footwear
- Product filtering and sorting
- Detailed product pages with size selection

### 📱 Responsive Design
- Mobile-first approach
- Sticky navigation with cart
- Smooth animations and transitions
- Touch-friendly interface

### 🎨 Smart UI Features
- Product cards with quick view
- Wishlist functionality
- Shopping cart with counter
- User profile dropdown
- Admin analytics dashboard
- User order history

## Pages

1. **Home** - Hero section, featured products, collection showcase
2. **Shop** - Full product catalog with filters and sorting
3. **Product Details** - Individual product pages with size selection
4. **Collections** - Curated seasonal collections
5. **About** - Brand story and values
6. **Contact** - Contact form and location info
7. **Dashboard** - Role-based (Admin or User)

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **Vite** - Build tool

## Security Notice

⚠️ **Important**: This is a demo application. Authentication uses `localStorage` for demonstration purposes only and is **NOT secure** for production use.

For production:
- Integrate with **Supabase** for secure authentication
- Use proper password hashing (bcrypt, argon2)
- Implement JWT tokens or session management
- Add HTTPS encryption
- Never store sensitive data in localStorage

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### Build for Production

```bash
pnpm run build
```

## Downloading the Project

From Figma Make:
1. Click the **three dots menu (•••)** in the top-right corner
2. Select **"Download code"** or **"Export project"**
3. Extract the ZIP file and run `pnpm install`

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── AuthModal.tsx
│   │   ├── SecurityNotice.tsx
│   │   ├── ProductCard.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── UserDashboard.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ShopPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CollectionsPage.tsx
│   │   ├── AboutPage.tsx
│   │   └── ContactPage.tsx
│   └── App.tsx
├── styles/
│   ├── theme.css
│   └── fonts.css
└── main.tsx
```

## User Roles

### Regular User
- Browse products
- View product details
- Add to wishlist
- View order history
- Manage profile

### Admin
- View analytics dashboard
- Manage orders
- View customer data
- Access admin controls
- Monitor sales metrics

## Demo Data

The application includes mock data for:
- 12+ Products across multiple categories
- Sample orders and order history
- Analytics and statistics
- User profiles

## Future Enhancements

To make this production-ready:
1. ✅ Connect to Supabase for secure authentication
2. ✅ Add real payment processing (Stripe, PayPal)
3. ✅ Implement inventory management
4. ✅ Add email notifications
5. ✅ Create order tracking system
6. ✅ Add product reviews and ratings
7. ✅ Implement search functionality
8. ✅ Add product recommendations

## License

This is a demo project for educational and portfolio purposes.

## Credits

- Images from Unsplash
- Icons from Lucide React
- Built with React and Tailwind CSS
