import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import itineraryRoutes from './src/routes/itineraryRoutes.js';
import errorMiddleware from './src/middlewares/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/.env` });

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(express.json());
app.use('/api', itineraryRoutes);
app.use(errorMiddleware);

try {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch (err) {
  console.error('DB Connection Error:', err);
  process.exit(1);
}
