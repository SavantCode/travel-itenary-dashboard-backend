import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
<<<<<<< Updated upstream
import itineraryRoutes from './src/routes/itineraryRoutes.js';
import errorMiddleware from './src/middlewares/errorMiddleware.js';
=======
import cors from 'cors'; // ✅ Import cors

import cookieParser from "cookie-parser";
import helmet from "helmet";


import itineraryRoutes from './src/routes/itineraryRoutes.js';
import hotelRoutes from './src/routes/hotelRoutes.js';
import vehicleRoutes from './src/routes/vehicleRoutes.js';
// import errorMiddleware from './src/middlewares/errorMiddleware.js';
// import errorMiddleware from './src/middlewares/errorMiddleware.js';

import { errorHandler } from './src/middlewares/errorMiddleware.js'; // ✅ Use a named import


import authRouter from './src/routes/auth.routes.js';
import adminRouter from './src/routes/admin.routes.js';
import itineraryRouter from './src/routes/itinerary.routes.js'
>>>>>>> Stashed changes

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env in project root
dotenv.config({ path: `${__dirname}/.env` }); // Adjust path if needed

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(helmet()); // For basic security headers

// Routes
app.use('/api', itineraryRoutes);
<<<<<<< Updated upstream
// app.use('/api/itinerary', itineraryRoutes);


// Error handler (keep at the end)
app.use(errorMiddleware);
=======
app.use('/api/hotels', hotelRoutes);
app.use('/api/vehicles', vehicleRoutes);

// --- Routes Declaration ---
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/itineraries", itineraryRouter);

// Error handler
// app.use(errorMiddleware);
app.use(errorHandler);

// Simple health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is healthy" });
});

>>>>>>> Stashed changes

// DB Connection and Server Start
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
} catch (err) {
  console.error('❌ DB Connection Error:', err);
  process.exit(1);
}
