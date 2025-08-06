import express from 'express';
import { recordScan, getSummary } from '../controllers/analyticsController.js';

const router = express.Router();
router.post('/record', recordScan);
router.get('/summary', getSummary);
export default router;
