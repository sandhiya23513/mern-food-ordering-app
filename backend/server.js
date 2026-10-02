const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { autoSeedFoods } = require('./controllers/foodController');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: '*', // Allow all during development and easily restricted in production
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB().then((connected) => {
  if (connected) {
    autoSeedFoods();
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Food Ordering API is running smoothly',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: ['/api/auth/register', '/api/auth/login', '/api/auth/me'],
      foods: ['/api/foods', '/api/foods/:id', '/api/foods/seed'],
      orders: ['/api/orders', '/api/orders/my-orders', '/api/orders/:id'],
    },
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/foods', require('./routes/foodRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

const path = require('path');

// Serve static frontend build if dist exists (for single-service deployment)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
const fs = require('fs');

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // Root route when frontend is hosted separately
  app.get('/', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>Food Ordering API - Backend Server</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 2rem; background: #0f172a; color: #f8fafc; }
            .card { background: #1e293b; padding: 1.5rem; border-radius: 8px; border: 1px solid #334155; max-width: 600px; margin: 0 auto; }
            h1 { color: #f97316; margin-top: 0; }
            a { color: #38bdf8; text-decoration: none; }
            a:hover { text-decoration: underline; }
            code { background: #0f172a; padding: 0.2rem 0.4rem; border-radius: 4px; color: #fbbf24; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>🍔 Food Ordering API Server</h1>
            <p>MERN Stack Backend is active and running.</p>
            <p>Test the health endpoint: <a href="/api/health"><code>/api/health</code></a></p>
            <p>Explore Food Items: <a href="/api/foods"><code>/api/foods</code></a></p>
          </div>
        </body>
      </html>
    `);
  });
}

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found at ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT} (http://localhost:${PORT})`);
});
