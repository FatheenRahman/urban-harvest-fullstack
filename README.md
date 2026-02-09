# Urban Harvest Hub

## Project Overview
Urban Harvest Hub is a **Progressive Web Application (PWA)** built with React (Frontend) and Express/MySQL (Backend). It features offline capabilities, secure authentication, and a responsive design.

## 🚀 How to Run

### Prerequisites
- Node.js (v16+)
- MySQL Server

### 1. Setup Database
1. Create a MySQL database named `urban_harvest_hub`.
2. Run the `server/schema.sql` script to create tables.
3. (Optional) Run `node server/seed.js` to populate sample data.
4. Update `server/.env` with your DB credentials.

### 2. Backend (Server)
```bash
cd server
npm install
npm start
```
Server runs on `http://localhost:5000`.

### 3. Frontend (Client)
```bash
cd client
npm install
npm run dev
```
Client runs on `http://localhost:5173`.

---

## 📱 PWA Implementation & Testing

### Service Worker Lifecycle
We use `vite-plugin-pwa` with `generateSW` strategy.
1.  **Install**: Service worker is registered on page load.
2.  **Activate**: Takes control of the client immediately (`clientsClaim: true`) to serve cached assets.
3.  **Fetch**: Intercepts network requests. We use a **Stale-While-Revalidate** strategy for API calls and **Cache-First** for static assets.

### Offline Testing
-   **Method**: Disconnect network via Chrome DevTools "Network" tab (Offline preset).
-   **Result**: The app continues to load static shell (HTML/CSS/JS) from Cache Storage. API calls may fail gracefully or show cached data if configured.

---

## 🔒 API Documentation

### Endpoints
-   `POST /api/auth/register` - Create account
-   `POST /api/auth/login` - Login & Get Token
-   `GET /api/events` - List all events (supports ?search=, ?category=)
-   `GET /api/events/:id` - Get single event details
-   `POST /api/events` - Create event (Protected)

---

## 🧠 Design Decisions
-   **Mobile-First**: Used TailwindCSS responsive classes (`md:`, `lg:`) to ensure layout adapts from phones to desktops.
-   **Architecture**: "Layered" pattern in backend (Controller-Service-Repository style) for maintainability.
