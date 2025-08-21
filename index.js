import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import itineraryRoutes from './src/routes/itineraryRoutes.js';
import errorMiddleware from './src/middlewares/errorMiddleware.js';

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env in project root
dotenv.config({ path: `${__dirname}/.env` }); // Adjust path if needed

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', itineraryRoutes);
// app.use('/api/itinerary', itineraryRoutes);


// Error handler (keep at the end)
app.use(errorMiddleware);

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
