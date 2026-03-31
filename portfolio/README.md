# Harshith K S — Personal Portfolio + Blog CMS

A personal portfolio website with a full blog management system built with React + Vite. Includes public-facing pages and a protected admin portal for creating, editing, and managing blog posts — all frontend-only with localStorage persistence.

**🌐 Live Site:** https://harshith-portfolio.vercel.app  
**📁 GitHub:** https://github.com/harshithks/portfolio

---

## What I Built

### Public Pages
- **Home** — My name, photo, bio, skills with animated progress bars, and recent blog posts
- **Projects** — 4 projects with full detail pages (click any card to read more)
- **Blog** — All published posts with tag filtering
- **Blog Post** — Individual post page with Markdown rendering

### Admin Portal
- **Login** — Username and password login (credentials: `admin` / `admin123`)
- **Dashboard** — View all blog posts in a table with stats
- **Create Post** — Add a new blog post with Write/Preview tabs
- **Edit Post** — Edit any existing blog post
- **Delete Post** — Delete with a confirmation modal
- **Publish / Draft** — Toggle post status with one click
- **Protected Routes** — Admin pages redirect to login if not authenticated

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Vanilla CSS with CSS custom properties |
| State | React Context + useState |
| Persistence | localStorage (blog posts), sessionStorage (auth) |
| Fonts | Bricolage Grotesque, DM Sans, JetBrains Mono |
| Deployment | Vercel |

---

## 🤖 AI Tools Used

### 1. Claude (Anthropic) — Primary Tool

**How it helped me:**

| Feature | How Claude Helped |
|---|---|
| Project setup | Used Claude to set up the Vite + React project structure and install dependencies |
| Design system | Used Claude to create the entire CSS design system — colors, variables, glassmorphism cards, buttons, badges |
| Home page | Used Claude to build the hero section with typewriter effect, particle canvas background, animated skill bars, and scroll reveal animations |
| Projects page | Used Claude to create the 3D tilt card effect and project detail pages |
| Blog pages | Used Claude to build the blog listing page with tag filter and the individual post page with a Markdown renderer |
| Admin Login | Used Claude to create the login form with session-based authentication |
| Admin Dashboard | Used Claude to build the dashboard table with stats, filter tabs, status toggle, and delete confirmation modal |
| Blog Editor | Used Claude to create the create/edit form with Write and Preview tabs, tag management, and word count |
| Custom hooks | Used Claude to write all interactive hooks — `useTypewriter`, `useTilt`, `useParallax`, `useScrollReveal`, `useCounter` |
| Particle canvas | Used Claude to build the animated particle background with mouse interaction using HTML5 Canvas |
| Routing | Used Claude to set up React Router v6 with protected admin routes |
| Blog context | Used Claude to write the BlogContext with full CRUD operations and localStorage persistence |
| Vercel config | Used Claude to create the `vercel.json` file for SPA routing |

---

### 2. GitHub Copilot — Secondary Tool

**How it helped me:**
- Used Copilot for autocomplete while writing repetitive JSX patterns (badge variants, list items)
- Used Copilot for inline suggestions while writing CSS property values
- Used Copilot to speed up small utility functions like date formatting

---

### 3. Manual Work — Personal Customisation

**What I wrote and did myself:**
- Updated all personal content — my name, bio, email, GitHub and LinkedIn links
- Added my own photo to the hero section and fixed the image path
- Customised all project descriptions with my real project details
- Wrote the blog seed posts based on my actual work experience
- Added the Virtual AI Psychiatrist as a 4th project
- Adjusted CSS spacing, animation timings, and image positioning by hand
- Debugged issues that came up during development

---

## 📊 Percentage of Code Written Using AI vs Manually

| Source | Percentage | Details |
|---|---|---|
| Claude (AI) | ~80% | Architecture, all components, hooks, animations, admin portal, design system |
| GitHub Copilot (AI) | ~10% | Autocomplete for repetitive patterns and small utilities |
| Written manually | ~10% | Personal content, photo integration, project customisation, debugging |

**Total AI-assisted: ~80% | Total manual: ~20%**

---

## ✅ Did I Understand the AI-Generated Code?

**Yes — I read through every file before using it and can explain how each part works.**

**React Context pattern**  
`createContext` creates a context. `Provider` wraps components that need it. `useContext` reads the value inside them. The order of providers in `App.jsx` matters — `AuthProvider` wraps `BlogProvider` so both are available app-wide.

**localStorage persistence**  
The `useEffect` in `BlogContext.jsx` runs every time `posts` changes. It writes the updated array to localStorage as JSON. On first load, `useState` reads from localStorage to restore previous data so blog posts survive a page refresh.

**ProtectedRoute**  
Reads `isAuthenticated` from `AuthContext`. If `false`, returns `<Navigate to="/admin/login" replace />` which redirects without adding to browser history. If `true`, renders the actual page (children).

**IntersectionObserver**  
Used in `useScrollReveal` and the skill bar animations. Watches when an element enters the viewport. When `isIntersecting` is true, it adds the `.revealed` CSS class to trigger the fade-up animation, then disconnects so it only fires once per element.

**Particle canvas**  
Uses `requestAnimationFrame` for a 60fps animation loop. Each particle has `x`, `y`, `vx` (velocity x), `vy` (velocity y). Every frame: clear the canvas → update positions → wrap particles around screen edges → draw lines between particles within 140px → draw each particle dot.

**3D tilt effect**  
`useTilt` calculates mouse position relative to the card using `getBoundingClientRect()`. Converts it to a -0.5 to 0.5 range, multiplies by intensity to get rotation degrees. Applies `perspective(800px) rotateX() rotateY()` as a CSS transform. Resets smoothly on mouse leave.

**Slug generation**  
Converts blog post titles to URL-safe strings. Lowercases, removes special characters with regex, replaces spaces with hyphens, trims to 80 chars. Example: `"My First Post!"` → `"my-first-post"`.

**Typewriter effect**  
`useTypewriter` hook uses `useState` for the displayed text and `useEffect` with `setTimeout`. It types characters one by one, then pauses, then deletes characters, then moves to the next word in the array. Cycles infinitely.

---

## 🚀 Run Locally

### Prerequisites
- Node.js v18 or higher — download from [nodejs.org](https://nodejs.org)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/harshithks/portfolio.git

# 2. Go into the project folder
cd portfolio

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

**Admin login:**
- URL: `http://localhost:5173/admin/login`
- Username: `admin`
- Password: `admin123`

---

## 🌐 Deploy on Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
3. Click **Add New Project** → Import your repository
4. Framework auto-detected as **Vite** → Click **Deploy**
5. Done — live in ~60 seconds

The `vercel.json` file is already included and handles SPA routing so all pages work correctly on the live URL:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

> **Note:** Blog posts are stored in the visitor's browser localStorage. Each visitor sees their own isolated copy. In a real production app this would connect to a backend database.