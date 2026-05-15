# ✨ Task Manager - Frontend Portal

A minimalist luxury dashboard for team productivity. This high-fidelity interface provides a seamless user experience for managing tasks and team members.

## 🎨 Design Philosophy
- **Aesthetic:** Minimalist Luxury (Glassmorphism, Symmetrical Layouts).
- **UX:** One-screen login, smooth Framer Motion transitions, and responsive data grids.
- **Typography:** Outfit (Modern Geometric Sans).

## 🛠 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Charts:** Recharts
- **State Management:** React Context API

## 📋 Features
- **High-Fidelity Login:** 1:1 split-screen layout with premium card aesthetics.
- **Interactive Dashboard:** Dynamic charts showing team productivity and task distribution.
- **Task Management:** Clean interface for filtering, updating, and approving tasks.
- **Team Portal:** Administrative view for managing members and permissions.
- **Responsive:** Optimized for desktop and mobile workflows.

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Run Development
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## 🌐 Deployment (Netlify/Vercel)
1. Push your code to GitHub.
2. Connect the repo to **Netlify**.
3. **Crucial:** Add the `NEXT_PUBLIC_API_URL` environment variable in the Netlify Dashboard pointing to your **Railway API**.
4. The project will automatically build and deploy.

---

## 🏗 Architecture
The frontend uses a centralized API utility in `src/lib/api.ts` to ensure that switching between development and production environments is handled via environment variables only.
