# Tea Social - Gen Z Social Media Platform 🎨

A beautiful, mobile-first social media platform with stunning animations, 3D elements, and seamless Cloudinary integration built with React + Vite + Tailwind CSS.

## ✨ Features

- **Beautiful Gen Z Aesthetic**: Vibrant gradients, glassmorphism, and modern design
- **Mobile-First Design**: Fully responsive with fixed bottom navigation
- **3D Animations**: Three.js powered 3D elements and GSAP scroll animations
- **Image Upload**: Upload-first post creation with Cloudinary integration
- **Location-Based**: Discover nearby posts with geolocation
- **Gender-Based Access**: Free for females, subscription-based for males
- **ID Verification**: Government ID upload for user verification
- **Real-Time Interactions**: Clap/like system with animations
- **Smooth Transitions**: Framer Motion page transitions

## 🚀 Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS with custom glassmorphic utilities
- **Animations**: GSAP, Framer Motion
- **3D Graphics**: Three.js, React Three Fiber
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Image Upload**: Cloudinary
- **Icons**: React Icons
- **Date Formatting**: date-fns

## 📦 Installation

### Prerequisites

- Node.js 16+ and npm
- Cloudinary account for image uploads
- Backend server running on `http://localhost:5000`

### Setup Steps

1. **Clone the repository**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables**
   
   Copy `.env.sample` to `.env` and fill in your credentials:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 📱 Pages

### Public Routes
- `/login` - Login page with animations
- `/signup` - Multi-step signup with ID verification and payment

### Protected Routes
- `/` - Home feed with infinite scroll
- `/create` - Create post (upload images first, then write)
- `/find` - Search and discover posts
- `/recommended` - Location-based recommended posts
- `/profile` - User profile with posts and stats

## 🎨 Design System

### Colors
- **Primary**: Purple/Pink gradient (#8B5CF6 → #EC4899)
- **Secondary**: Cyan/Blue (#06B6D4 → #3B82F6)
- **Accent**: Neon green (#10B981)

### Components
- Glassmorphic cards with backdrop blur
- Animated buttons with hover effects
- Floating labels for inputs
- Skeleton loaders
- 3D animated loaders

## 🔑 Key Features

### Authentication
- Email/password login
- Multi-step signup:
  1. User details (name, email, gender)
  2. Government ID upload (DL/Aadhar)
  3. Location permission
  4. Payment (for male users)

### Post Creation
- Upload images first (optimized UX)
- Upload progress indicators
- Rich text editor
- Location tagging (optional)
- Multiple image support

### Interactions
- Clap/like posts with animation
- Optimistic UI updates
- Skeleton loaders during fetch
- GSAP scroll animations

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── post/         # Post-related components
│   │   └── routes/       # Route guards
│   ├── pages/            # Page components
│   ├── context/          # React Context providers
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
└── package.json          # Dependencies
```

## 🔌 Backend Integration

The frontend connects to the backend API running on `http://localhost:5000/api`.

### Implemented Endpoints
- `POST /user/create-user` - User registration
- `POST /user/login` - User login
- `GET /posts/` - Fetch all posts
- `POST /posts/create-post` - Create new post
- `POST /posts/:id` - Clap/like a post
- `GET /posts/recommended` - Get location-based posts

### Missing Endpoints (To Implement)
- `GET /user/me` - Get current user data
- `POST /user/upload-id` - Upload government ID
- `POST /subscription/create` - Create subscription
- `POST /payment/initiate` - Payment gateway integration

See `implementation_plan.md` for complete list of missing routes.

## 📸 Cloudinary Setup

1. Create a Cloudinary account at https://cloudinary.com
2. Get your **Cloud Name** from the Dashboard
3. Create an **Upload Preset**:
   - Go to Settings → Upload
   - Scroll to Upload Presets
   - Click "Add upload preset"
   - Set mode to "Unsigned"
   - Configure folder structure (optional)
   - Save the preset name
4. Add credentials to `.env` file

## 🎯 Features To Add

- [ ] Post detail page
- [ ] Comments system
- [ ] User search
- [ ] Follow/unfollow users
- [ ] Notifications
- [ ] Share functionality
- [ ] PWA manifest
- [ ] Dark mode toggle
- [ ] Image optimization
- [ ] Lazy loading

## 🐛 Known Issues

-  React 18.3.1 used instead of React 19 due to dependency conflicts
- Payment gateway integration pending (shows UI only)
- Token refresh endpoint not implemented
- Some animations may be heavy on low-end devices

## 📝 License

This project is part of a personal portfolio.

## 👤 Author

Built with ❤️ for Gen Z

---

**Note**: This is the frontend only. Make sure the backend server is running on `http://localhost:5000` before starting the frontend.
