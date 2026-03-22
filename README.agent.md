# AI Agent Resource: Elena Store Implementation Guide

This document is a technical and brand manifest for AI agents working on the Elena Store project. Use this as your "source of truth" to ensure consistency in development, design, and user experience.

---

## 🎨 Brand Identity

Elena Store is a premium, modern e-commerce platform for fashion/accessories, primarily serving the Arabic-speaking market.

- **Brand Name**: `Elena Store | ايلينا ستور`
- **Primary Language**: Arabic (`ar`)
- **Layout Direction**: Right-to-Left (`rtl`)
- **Typography**: 
  - Main Font: `Zain` (Rubik as variable fallback)
- **Color Palette (OKLCH)**:
  - **Primary**: `oklch(0.7536 0.1078 344.74)` (Vibrant Pink/Magenta)
  - **Secondary**: `oklch(0.2169 0.0758 274.89)` (Deep Violet)
  - **Background**: `oklch(0.98 0.01 340)` / `#F8F6F7` (Soft Pearl/Grey Pink)
- **Aesthetics**: Premium, clean, minimalist with smooth animations (Framer Motion).

---

## 🛠 Tech Stack

### Frontend (Next.js 15 Monolith)
- **Framework**: `Next.js 15 (App Router)`
- **Styling**: `Tailwind CSS 4` (High-performance, modern selectors)
- **State Management**: `Zustand`
- **Data Fetching**: `@tanstack/react-query` (with `axios`)
- **UI Components**: `Radix UI` primitives, `Lucide` icons.
- **Form Handling**: `React Hook Form` + `Zod` validation.
- **Animations**: `Framer Motion` (motion-dom).

### Backend (Express API)
- **Runtime**: `Node.js` (ES Modules)
- **Framework**: `Express 5`
- **Database**: `MongoDB` (Mongoose)
- **Caching/Rate Limiting**: `Redis` (ioredis)
- **Auth**: `JWT` + `Cookie-parser` + `Bcrypt`
- **Storage**: `Cloudinary` (Images)

---

## 🔄 Application Flow

### 🛒 User Journey
1. **Landing/Discovery**: Homepage -> Search/Filter -> Category Listing.
2. **Product Engagement**: Product Detail -> Add to Wishlist/Cart.
3. **Checkout Flow**: Cart -> Shipping Details (Buy Now) -> Payment -> Thank You Page.
4. **Profile Management**: Auth (Login/Register) -> My Orders -> Wishlist.

### 🛡 Admin Journey
1. **Dashboard Overview**: Sales metrics.
2. **Catalog Management**: Add/Edit/Delete Products & Categories.
3. **Order Management**: Track status, manage shipping.

---

## 📜 Development Guidelines

### RTL-First Development
- Always use logical properties for layout (`padding-inline`, `margin-block`, etc.).
- Ensure components are tested in `rtl` context.
- Text alignment should default to right.

### Code Standards
- **Component Structure**: `components/` for reusable UI, `app/(main)/` for features.
- **Handling State**: Use `Zustand` for global state (cart, auth), `React Query` for server state.
- **Error Handling**: Use `Sonner` for toast notifications.
- **Type Safety**: Strictly TypeScript for frontend, Joi/Zod for backend validation.

### UI/UX Rules
- Use smooth micro-interactions (hover, transitions).
- Avoid generic colors; stick to the brand OKLCH palette.
- Prioritize visual excellence; every component should feel premium.

---

## 🧪 Quick Reference Commands
- **Frontend Dev**: `npm run dev` (in `frontend/`)
- **Backend Dev**: `npm run dev` (in `backend/`)
- **Database**: MongoDB (Production connection string in `.env`)
