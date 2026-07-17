import express from 'express';
import { getAssessmentReport } from '../controllers/report.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/assessment/:assessmentId', protect, getAssessmentReport);

export default router;
