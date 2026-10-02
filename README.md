# 🍔 FoodExpress - Full-Stack MERN Food Ordering Web Application

> **College Laboratory Experiment & Project Submission**  
> **Topic:** Develop and deploy a complete full-stack MERN Application integrating React, Express.js, MongoDB, REST APIs, authentication, and Cloud Deployment.

---

## 🌟 1. Project Overview

**FoodExpress** is a production-grade full-stack food delivery web application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). It provides an end-to-end user workflow: browsing categorized culinary dishes, filtering and searching food items, adding to an interactive shopping cart, secure user registration and login with JWT and bcrypt, delivery address checkout, automated order recording in MongoDB Atlas, and visual real-time order history tracking.

---

## 🏗️ 2. MERN System Architecture

```text
+---------------------------------------------------------------------------------+
|                                 CLIENT TIER                                     |
|  React 19 (Vite) + React Router 7 + Context API (Cart & Auth) + Lucide Icons   |
+---------------------------------------------------------------------------------+
                                      |
                           HTTPS / REST API Calls
                         (JSON Payloads + Bearer JWT)
                                      v
+---------------------------------------------------------------------------------+
|                                 SERVER TIER                                     |
|     Node.js + Express.js Web Server (Port 5000)                                 |
|     - CORS & JSON Body Parser                                                   |
|     - Authentication Middleware (JWT Verification)                              |
|     - REST API Controllers (Auth, Foods, Orders)                                |
+---------------------------------------------------------------------------------+
                                      |
                               Mongoose ODM
                         (Schema Validation & Hooks)
                                      v
+---------------------------------------------------------------------------------+
|                                DATABASE TIER                                    |
|               MongoDB Atlas Cloud Database (Cluster M0 Sandbox)                 |
|               Collections: 'users', 'foods', 'orders'                           |
+---------------------------------------------------------------------------------+
```

---

## 🛠️ 3. Technologies & Stack Breakdown

| Technology | Purpose & Implementation |
| :--- | :--- |
| **React.js 19 (Vite)** | Blazing-fast Single Page Application (SPA), responsive UI components, dynamic hooks (`useState`, `useEffect`, `useContext`). |
| **Node.js (v20+)** | Asynchronous, event-driven JavaScript runtime environment executing the backend service. |
| **Express.js (v5)** | Minimalist web framework managing REST API endpoints, routing, error handling, and middleware. |
| **MongoDB Atlas** | Fully managed multi-cloud document database hosting `users`, `foods`, and `orders`. |
| **Mongoose ODM (v9)** | Object Data Modeling library defining strict schemas, models, pre-save hooks, and relationships. |
| **JWT (jsonwebtoken)** | Stateless Bearer token authentication securing private routes (`/orders`, `/checkout`, `/dashboard`). |
| **Bcrypt.js** | Cryptographic salted hashing protecting user passwords in database storage. |
| **Axios** | HTTP client with automatic request interceptors attaching Bearer JWT tokens. |
| **Lucide React** | Modern, accessible SVG icon library for crisp visual indicators. |

---

## 📋 4. Features Checklist (Experiment Requirements Satisfied)

### 1. User Authentication
- ✅ User Registration with full name, email, password, phone, and delivery address.
- ✅ User Login with credential verification via `bcryptjs.compare()`.
- ✅ Signed JSON Web Token (JWT) issued on login/registration (valid for 30 days).
- ✅ Secure Client-Side Session Storage with auto-login on reload.
- ✅ Instant Logout clearing client tokens.
- ✅ Protected Routes (`<ProtectedRoute>`) guarding Checkout, Orders, and Dashboard.

### 2. Food Menu
- ✅ Displays core required menu items:
  - **Pizza** - ₹250 *(Margherita Delight with mozzarella & sweet basil)*
  - **Burger** - ₹150 *(Classic Veggie Cheese with brioche bun)*
  - **Biryani** - ₹220 *(Hyderabadi Dum Biryani with saffron basmati)*
  - **Pasta** - ₹180 *(Creamy Alfredo Penne in garlic parmesan sauce)*
  - **Sandwich** - ₹120 *(Grilled Club Sandwich with paneer tikka)*
  - *Plus crispy French Fries (₹99), Sizzling Brownie (₹130), and Cold Coffee (₹90).*
- ✅ Each food item displays: Name, Description, Price (in ₹), High-res Image, Category tag, Veg/Non-Veg indicator, and Rating.
- ✅ Quick Detail Modal and dedicated `/food/:id` view.
- ✅ Live Search and Category filter tabs (Pizza, Burger, Biryani, Pasta, Sandwich, etc.).

### 3. Shopping Cart
- ✅ Add food to cart directly from Menu or Food Card.
- ✅ Quantity controls: Increase (`+`) or Decrease (`-`) item counts.
- ✅ Delete/remove individual item from cart.
- ✅ "Clear Cart" button with single-click reset.
- ✅ Real-time price computation: Item Subtotal + Delivery Fee (₹40, or **FREE** on orders ≥ ₹500) + 5% GST = Total Amount.
- ✅ Persistent Cart state saved across browser refreshes via `localStorage`.

### 4. Ordering & Checkout
- ✅ Dedicated Checkout Page (`/checkout`).
- ✅ Customer Information form (Recipient Name, Contact Phone, Delivery Address, Landmark Notes).
- ✅ Auto-fills user details from logged-in profile.
- ✅ Payment method selection (Cash on Delivery, UPI Simulation, Credit/Debit card).
- ✅ Live Order Summary with itemized review.
- ✅ Generates persistent Order Record in MongoDB Atlas.

### 5. Order History & Tracking
- ✅ User Order History page (`/orders`) fetching all previous orders for the logged-in user.
- ✅ Itemized breakdown, thumbnails, order date/time, and total price.
- ✅ Visual delivery progress stepper (`Placed` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered`).
- ✅ Interactive "Simulate Status" button for live viva demonstration!

---

## 📡 5. REST API Documentation

### 🔐 Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Registers a new user. Body: `{ name, email, password, phone, address }`. |
| `POST` | `/api/auth/login` | Public | Authenticates user. Body: `{ email, password }`. Returns `{ token, user }`. |
| `GET` | `/api/auth/me` | Private (JWT) | Retrieves currently authenticated user profile. |

### 🍕 Food Endpoints (`/api/foods`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/foods` | Public | Returns all food items. Query params: `?category=Pizza&search=cheese&vegOnly=true`. |
| `GET` | `/api/foods/:id` | Public | Returns single food item details. |
| `POST` | `/api/foods/seed` | Public | Resets & seeds default dishes into MongoDB Atlas. |

### 📦 Order Endpoints (`/api/orders`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Private (JWT) | Places an order and stores record in MongoDB. |
| `GET` | `/api/orders/my-orders` | Private (JWT) | Retrieves all orders placed by the current user. |
| `GET` | `/api/orders/:id` | Private (JWT) | Retrieves specific order details by ID. |
| `PUT` | `/api/orders/:id/status`| Private (JWT) | Updates status (`Placed`, `Preparing`, `Out for Delivery`, `Delivered`). |

---

## 🚀 6. Step-by-Step Local Setup Guide

### Prerequisites
1. **Node.js** (v18.0 or higher) - [Download Node.js](https://nodejs.org/)
2. **MongoDB Atlas Account** (Free tier) OR **Local MongoDB Community Server**

### Step 1: Clone or Navigate to the Project Folder
```bash
cd C:\Users\ELCOT\.gemini\antigravity\scratch\food-ordering-app
```

### Step 2: Configure Backend Environment Variables
In `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/food_ordering_app?retryWrites=true&w=majority
JWT_SECRET=supersecret_mern_food_delivery_jwt_key_2026_antigravity
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
*(If testing locally without Atlas, you can use `MONGODB_URI=mongodb://localhost:27017/food_ordering_app`)*.

### Step 3: Run the Backend Server
Open Terminal 1:
```bash
cd backend
npm run dev
```
You will see:
```text
🚀 Server listening on port 5000 (http://localhost:5000)
✅ MongoDB Connected Successfully: cluster0...
🌱 Food menu auto-seeded with default items (Pizza, Burger, Biryani, Pasta, Sandwich)!
```

### Step 4: Run the React Frontend
Open Terminal 2:
```bash
cd frontend
npm run dev
```
Open your browser and navigate to: **`http://localhost:5173`**

---

## ☁️ 7. Cloud Deployment Guide (Free Tier)

This application is ready to deploy to free cloud hosting platforms!

### Part A: Deploy Database (MongoDB Atlas)
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **Free Shared Cluster (M0)**.
3. Under **Security > Database Access**, add a user with `readWriteAnyDatabase` permissions (e.g., username `admin`, password `yourpassword123`).
4. Under **Security > Network Access**, click **Add IP Address** and choose **Allow Access From Anywhere (`0.0.0.0/0`)** so your cloud backend can connect.
5. Click **Connect > Drivers (Node.js)** and copy your connection string:
   ```text
   mongodb+srv://admin:yourpassword123@cluster0.abcde.mongodb.net/food_ordering_app?retryWrites=true&w=majority
   ```

---

### Part B: Deploy Backend API to Render (Free)
1. Push your project to a GitHub repository.
2. Sign in to [Render.com](https://render.com/).
3. Click **New + > Web Service**.
4. Connect your GitHub repository.
5. Set:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
6. Under **Environment Variables**, add:
   - `MONGODB_URI`: `your_atlas_connection_string`
   - `JWT_SECRET`: `your_random_secret_key`
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
7. Click **Create Web Service**. Once deployed, Render will provide a live URL, e.g., `https://food-backend-xxxx.onrender.com`.

---

### Part C: Deploy Frontend to Vercel (Free)
1. Sign in to [Vercel.com](https://vercel.com/).
2. Click **Add New... > Project** and import your GitHub repository.
3. Configure Project Settings:
   - **Root Directory:** Edit to select `frontend`.
   - **Framework Preset:** `Vite`.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://food-backend-xxxx.onrender.com/api` (your backend URL from Part B).
5. Click **Deploy**.
6. Vercel will build and assign you a live HTTPS domain (e.g., `https://food-express-mern.vercel.app`).
7. Back in your Render backend settings, update `CLIENT_URL` to your Vercel URL to restrict CORS to your domain.

---

## 🎓 8. College Laboratory Viva Q&A Cheat-Sheet

**Q1: What does MERN stand for and how do the tiers communicate?**  
*Answer:* MERN stands for **MongoDB** (Database), **Express.js** (Backend Framework), **React.js** (Frontend UI), and **Node.js** (JavaScript Runtime). The React client sends asynchronous HTTP requests via Axios or Fetch to Express API endpoints. Express interacts with MongoDB through Mongoose models and returns JSON data to React.

**Q2: How is password security implemented in this project?**  
*Answer:* We use `bcryptjs` with salt rounds (10). In the Mongoose `User` schema, a `pre('save')` hook intercepts plain text passwords before writing to MongoDB and replaces them with an irreversible cryptographic hash. During login, `bcrypt.compare()` compares the plain text input against the stored hash.

**Q3: How does JWT authentication work?**  
*Answer:* When a user registers or logs in, the server generates a JSON Web Token signed with a secret key (`jwt.sign({ id: user._id }, SECRET, { expiresIn: '30d' })`). The client stores this token in `localStorage`. For protected endpoints (`/orders`, `/checkout`), an Axios interceptor attaches the token as `Authorization: Bearer <token>`. The Express middleware `protect` decodes and verifies the token using `jwt.verify()`.

**Q4: How does MongoDB Atlas differ from local MongoDB?**  
*Answer:* Local MongoDB runs as an operating system service on `localhost:27017`. MongoDB Atlas is a multi-cloud Database-as-a-Service (DBaaS) managed in the cloud with automated backups, horizontal scaling, replica sets, and global accessibility required for cloud production deployments.

**Q5: Why is Vite preferred over Create React App (CRA)?**  
*Answer:* Vite uses native ES Modules (ESM) and an esbuild-powered bundler written in Go, resulting in near-instant development server boot times and ultra-fast Hot Module Replacement (HMR) compared to Webpack-based CRA.

---

## 📂 9. Project Directory Structure

```text
food-ordering-app/
├── package.json               # Root scripts runner
├── README.md                  # Complete documentation & viva guide
├── backend/
│   ├── .env                   # Environment secrets
│   ├── .env.example           # Example config for deployment
│   ├── package.json           # Backend dependencies & scripts
│   ├── server.js              # Express entrypoint & middleware
│   ├── config/
│   │   └── db.js              # Mongoose Atlas connection handler
│   ├── controllers/
│   │   ├── authController.js  # Register, login, profile logic
│   │   ├── foodController.js  # Menu retrieval, search, auto-seeding
│   │   └── orderController.js # Order creation, history, status updates
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT Bearer verification middleware
│   ├── models/
│   │   ├── User.js            # User schema with bcrypt hashing
│   │   ├── Food.js            # Dish schema (Pizza, Burger, Biryani...)
│   │   └── Order.js           # Order schema with items & delivery
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth endpoints
│   │   ├── foodRoutes.js      # /api/foods endpoints
│   │   └── orderRoutes.js     # /api/orders endpoints
│   └── seeds/
│       └── seedFoods.js       # Default food items array
└── frontend/
    ├── package.json           # React dependencies
    ├── vite.config.js         # Vite config with API proxy
    ├── vercel.json            # Vercel SPA routing rewrites
    ├── index.html             # HTML shell with Google Fonts
    ├── public/
    │   └── _redirects         # Netlify SPA redirect rule
    └── src/
        ├── main.jsx           # React root mount
        ├── App.jsx            # Router and Provider configuration
        ├── index.css          # Comprehensive responsive styling
        ├── context/
        │   ├── AuthContext.jsx# User login/register/logout state
        │   └── CartContext.jsx# Cart items, quantities, totals
        ├── services/
        │   └── api.js         # Axios client with JWT interceptor
        ├── components/
        │   ├── Navbar.jsx     # Navigation bar with cart badge
        │   ├── Footer.jsx     # Project credits and MERN badges
        │   ├── FoodCard.jsx   # Interactive food item card
        │   ├── FoodModal.jsx  # Accessible dish detail dialog
        │   └── ProtectedRoute.jsx # Auth route protection
        └── pages/
            ├── Home.jsx       # Hero banner, featured dishes, stats
            ├── Menu.jsx       # Filterable catalog with search & veg toggle
            ├── FoodDetail.jsx # Deep-link dish details page
            ├── Cart.jsx       # Basket items, pricing breakdown
            ├── Checkout.jsx   # Delivery form & order submission
            ├── OrderHistory.jsx # Past orders & real-time status tracker
            ├── Dashboard.jsx  # Customer profile & viva guide
            ├── Login.jsx      # Login page with demo autofill
            └── Register.jsx   # Registration form with validation
```

---

## 🏆 Project Accomplishment
This project satisfies all requirements for the **College Full-Stack MERN Experiment**, featuring modern clean code, production-ready security, complete UI states, and streamlined online deployment.
