import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import analyticsRoutes from './routes/analyticsRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/analytics', analyticsRoutes);

const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(port, () => console.log(`Server running on port ${port}`)))
  .catch(err => console.error('DB connect error', err));
