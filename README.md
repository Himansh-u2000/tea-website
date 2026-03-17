<p align="center">
  <h1 align="center">☕ Tea Social</h1>
  <p align="center">
    <strong>A hyper-local, anonymous gossip & community platform — think "neighbourhood tea" but digital.</strong>
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#deployment">Deployment</a> •
    <a href="#api-reference">API Reference</a> •
    <a href="#contributing">Contributing</a>
  </p>
</p>

---

## 📖 What is Tea Social?

**Tea Social** is a location-aware social platform where users can share and discover gossip, stories, and posts from people in their neighbourhood. Every post is geo-tagged, so the feed you see is personalised to *your* area — the closer the tea, the hotter it appears.

Users can write rich-text posts with image attachments, clap (like) posts and comments, engage in threaded discussions, search & explore content, and unlock premium features through a Stripe-powered subscription.

The platform features a modern, dark-themed UI with smooth animations, skeleton loading states, parallax effects, and an Instagram-style explore grid — all designed for a mobile-first experience.

---

## 🎯 Who Can Use Tea Social?

| Audience | How they use it |
|---|---|
| **Community members** | Share local news, rumours, and gossip anonymously or with a profile |
| **Neighbourhood groups** | Discover what's happening within a configurable radius (~10 km) |
| **Content creators** | Write rich-text stories with embedded images and build a following |
| **Premium subscribers** | Access exclusive features via a monthly Stripe subscription |
| **Administrators** | Manage content and users through admin-level controllers |

> **Age & Identity**: Users sign up with email/password or Google OAuth. Government ID verification (Aadhaar / Driving Licence) is supported for trust badges.

---

## ✨ Features

### Core Social Features
- 📝 **Rich-Text Post Creation** — Full WYSIWYG editor (React Quill) with image uploads via Cloudinary
- 👏 **Clap System** — Clap on posts and comments (permanent, no un-clap). Claps are buffered in Redis and synced to MongoDB every 10 minutes via cron
- 💬 **Threaded Comments** — Comment on posts, reply to comments, and clap on individual comments
- 🔍 **Explore & Search** — Instagram-style grid with real-time search across titles, content, usernames, and locations
- ♾️ **Infinite Scroll** — Paginated feed with `IntersectionObserver` for seamless endless scrolling
- 📍 **Geo-Recommended Feed** — Posts sorted by proximity using MongoDB `$near` geospatial queries with a 10 km radius

### User & Authentication
- 🔐 **Email/Password Auth** — Secure sign-up and login with bcrypt-hashed passwords
- 🔑 **Google OAuth 2.0** — One-click sign-in via Google using `@react-oauth/google`
- 🪪 **Government ID Verification** — Upload Aadhaar or DL for verified status badges
- 🔄 **JWT Token System** — Access tokens (1-day) + refresh tokens (5-day) for session management
- 👤 **User Profiles** — Profile photos, gender, phone, location, and post history

### Premium & Payments
- 💳 **Stripe Subscriptions** — Monthly subscription checkout with automatic billing
- ✅ **Session Verification** — Secure post-payment verification via Stripe Checkout sessions
- 🏷️ **Subscription Management** — Track active/expired subscriptions with start and end dates

### Performance & Security
- ⚡ **Redis Caching** — Geohash-based cache keys for recommended posts; Redis Sets for clap deduplication
- 🛡️ **Rate Limiting** — 100 requests per 15 minutes per IP via `express-rate-limit`
- 🔒 **CORS Protection** — Whitelisted origins with credentials support
- 🧹 **Cron Jobs** — Automated clap sync from Redis → MongoDB every 10 minutes

### UI / UX
- 🌙 **Dark Theme** — Sleek glassmorphism-inspired dark design
- 🎞️ **Smooth Animations** — Framer Motion page transitions, parallax scrolling, and micro-interactions
- 💀 **Skeleton Loaders** — Beautiful loading placeholders for cards and grids
- 📱 **Mobile-First** — Bottom navigation bar, responsive layouts, and touch-friendly interactions
- 🎨 **3D Elements** — Three.js / React Three Fiber integration for premium visual effects

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | Component-based UI framework |
| **Vite 5** | Lightning-fast dev server & bundler |
| **Tailwind CSS 3** | Utility-first styling |
| **Framer Motion** | Page transitions & animations |
| **React Router v6** | Client-side routing with protected routes |
| **React Quill** | Rich-text editor for post creation |
| **Axios** | HTTP client with interceptors |
| **@react-oauth/google** | Google OAuth integration |
| **Stripe React** | Payment UI components |
| **Three.js / R3F** | 3D visual effects |
| **GSAP** | Advanced scroll-based animations |
| **Embla Carousel** | Touch-friendly image carousels |
| **React Icons** | Icon library |
| **date-fns** | Date formatting utilities |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **MongoDB + Mongoose** | Document database with geospatial indexes |
| **Redis** | Caching layer for posts & clap deduplication |
| **JWT (jsonwebtoken)** | Authentication tokens |
| **bcrypt** | Password hashing |
| **Stripe SDK** | Payment processing |
| **googleapis** | Google OAuth server-side verification |
| **node-cron** | Scheduled tasks (clap sync) |
| **ngeohash** | Geohash encoding for cache keys |
| **express-rate-limit** | API rate limiting |
| **Helmet** | HTTP security headers |
| **Cloudinary** (via frontend) | Image hosting & transformation |

---

## 🏗 Architecture

```
tea-website/
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Layout shell, header, footer
│   │   │   ├── post/           # PostCard and post-related UI
│   │   │   ├── routes/         # ProtectedRoute wrapper
│   │   │   └── ui/             # BottomNav, Skeleton, shared UI
│   │   ├── context/            # AuthContext (React Context API)
│   │   ├── pages/              # Route-level page components
│   │   │   ├── Home.jsx        # Main feed with infinite scroll
│   │   │   ├── FindPosts.jsx   # Explore grid with search
│   │   │   ├── Recommended.jsx # Geo-based recommended feed
│   │   │   ├── CreatePost.jsx  # Rich-text post editor
│   │   │   ├── Profile.jsx     # User profile & posts
│   │   │   ├── Subscription.jsx# Stripe checkout page
│   │   │   ├── Login.jsx       # Email + Google login
│   │   │   ├── Signup.jsx      # Registration with location
│   │   │   ├── VerifyGender.jsx# Gender verification step
│   │   │   └── Complete.jsx    # Post-payment success page
│   │   ├── services/           # API service layer
│   │   │   ├── api.js          # Axios instance setup
│   │   │   ├── authService.js  
│   │   │   ├── postService.js  
│   │   │   ├── commentService.js
│   │   │   ├── paymentService.js
│   │   │   └── cloudinaryService.js
│   │   └── utils/              # Helper utilities
│   ├── .env.sample             # Frontend environment template
│   ├── tailwind.config.js
│   └── vite.config.js          # Vite config with API proxy
│
├── backend/                    # Express REST API
│   ├── src/
│   │   ├── conf/index.js       # Env config + Redis client init
│   │   ├── controllers/
│   │   │   ├── auth.controller.js         # Signup, login, OAuth
│   │   │   ├── post.controller.js         # CRUD, clap, pagination
│   │   │   ├── comment.controller.js      # Comments, replies, clap
│   │   │   ├── subscription.controller.js # Stripe checkout & verify
│   │   │   ├── user.controller.js         # Profile management
│   │   │   └── admin.controller.js        # Admin operations
│   │   ├── models/
│   │   │   ├── user.model.js       # User with geospatial index
│   │   │   ├── post.model.js       # Post with 2dsphere index
│   │   │   ├── comment.model.js    # Threaded comments
│   │   │   └── subscription.model.js
│   │   ├── middleware/             # Auth middleware, error handler
│   │   ├── routes/                 # Express routers
│   │   ├── cron/                   # Scheduled jobs (clap sync)
│   │   ├── util/                   # ApiResponse, ApiError, DB connection
│   │   └── server.js              # App entry point
│   └── .env                       # Backend environment variables
│
└── .github/                       # GitHub Actions / workflows
```

### Data Flow

```
Browser ──► Vite Dev Proxy (/api) ──► Express API ──► MongoDB
                                          │
                                          ├──► Redis (cache, claps)
                                          ├──► Stripe (payments)
                                          ├──► Google APIs (OAuth)
                                          └──► Nominatim (reverse geocoding)
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| **Node.js** | ≥ 18.x |
| **npm** | ≥ 9.x |
| **MongoDB** | ≥ 6.x (local or Atlas) |
| **Redis** | ≥ 7.x (local or cloud) |
| **Stripe Account** | For payment processing |
| **Google Cloud Project** | For OAuth 2.0 credentials |
| **Cloudinary Account** | For image uploads |

### 1. Clone the repository

```bash
git clone https://github.com/Himansh-u2000/tea-website.git
cd tea-website
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=8000

# Database
DB_URL=mongodb://127.0.0.1:27017/teawebsite

# JWT Secrets (use strong random strings in production)
JWT_SECRET=your_jwt_secret_here
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Frontend URL (for CORS and Stripe redirect)
FRONTEND_URL=http://localhost:5173

# Google OAuth 2.0
OAUTH_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
OAUTH_SECRET=your_google_oauth_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PRODUCT_ID=prod_your_product_id
```

Start the backend:

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

> The backend runs on **http://localhost:8000** by default.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory (or copy `.env.sample`):

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
VITE_STRIPE_PRICE_ID=price_your_stripe_price_id
```

Start the frontend:

```bash
npm run dev
```

> The frontend runs on **http://localhost:5173** and proxies `/api` requests to the backend.

### 4. Services Setup

#### MongoDB
```bash
# Local MongoDB
mongod --dbpath /data/db

# Or use MongoDB Atlas connection string in DB_URL
```

#### Redis
```bash
# Local Redis
redis-server

# The app connects to localhost:6379 by default
```

#### Cloudinary
1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Create an unsigned upload preset in **Settings → Upload → Upload presets**
3. Copy your cloud name and preset name into the frontend `.env`

#### Google OAuth 2.0
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials (**APIs & Services → Credentials**)
3. Set authorized redirect URI to `http://localhost:5173`
4. Copy Client ID and Secret into both frontend and backend `.env` files

#### Stripe
1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from **Developers → API Keys**
3. Create a subscription product and price in the Stripe Dashboard
4. Copy the keys and IDs into the `.env` files

---

## 🌐 Deployment

### Option A: Manual VPS Deployment

#### 1. Provision a Server
Use any cloud provider (AWS EC2, DigitalOcean, Linode, etc.) with:
- Ubuntu 22.04+ or similar Linux distro
- Node.js 18+, MongoDB, and Redis installed

#### 2. Build the Frontend

```bash
cd frontend
npm run build
```

This generates a `dist/` folder with static assets.

#### 3. Serve the Frontend
Use **Nginx** to serve the built frontend and reverse-proxy API requests:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve the frontend SPA
    root /var/www/tea-website/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to the backend
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 4. Run the Backend with PM2

```bash
cd backend
npm install --production

# Install PM2 globally
npm install -g pm2

# Start the server
pm2 start src/server.js --name tea-api

# Auto-restart on reboot
pm2 startup
pm2 save
```

#### 5. SSL with Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

### Option B: Platform Deployment

#### Frontend → Vercel / Netlify

1. Connect your GitHub repository
2. Set the build settings:
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
   - **Root directory**: `frontend`
3. Add all `VITE_*` environment variables in the platform dashboard
4. Deploy

#### Backend → Render / Railway / Fly.io

1. Connect your GitHub repository
2. Set the root directory to `backend`
3. Set the start command to `npm start`
4. Add all backend environment variables
5. Use a **managed MongoDB** (e.g., MongoDB Atlas) and **managed Redis** (e.g., Redis Cloud, Upstash)

> **Important**: Update `FRONTEND_URL` in the backend to your deployed frontend URL, and update `VITE_API_BASE_URL` in the frontend to your deployed backend URL.

---

### Option C: Docker (Coming Soon)

A `docker-compose.yml` for local development with MongoDB and Redis containers is planned.

---

## 📡 API Reference

All endpoints are prefixed with `/api`.

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/user/signup` | Register a new user |
| `POST` | `/api/user/login` | Login with email/password |
| `GET` | `/api/user/google` | Google OAuth login |

### Posts
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/posts` | Fetch all active posts |
| `GET` | `/api/posts/paginated` | Paginated post feed |
| `GET` | `/api/posts/recommended` | Geo-based recommended posts |
| `GET` | `/api/posts/post?post=slug` | Fetch a single post by URL slug |
| `GET` | `/api/posts/user?userId=id` | Fetch all posts by a user |
| `POST` | `/api/posts` | Create a new post |
| `POST` | `/api/posts/:id/clap` | Clap on a post |
| `DELETE` | `/api/posts` | Delete a post |

### Comments
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/comment/:postId` | Fetch comments for a post |
| `POST` | `/api/comment` | Create a comment |
| `POST` | `/api/comment/reply` | Reply to a comment |
| `POST` | `/api/comment/clap` | Clap on a comment |

### Subscriptions
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/subscription/subscribe` | Create Stripe checkout session |
| `POST` | `/api/subscription/verify` | Verify payment session |
| `POST` | `/api/subscription/status` | Check subscription status |

### Health
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m "Add amazing feature"`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Tips
- The Vite dev server proxies `/api` to `localhost:8000` — no CORS issues in development
- Redis must be running for clap features and recommended posts caching
- Check the browser console and backend terminal for detailed error logs
- Use the `.env.sample` files as reference for required environment variables

---

## 📄 License

This project is **UNLICENSED** — all rights reserved.

---

<p align="center">
  Made with ☕ and 💜
</p>
