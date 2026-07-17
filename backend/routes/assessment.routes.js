import express from 'express';
import { 
  startAssessment, 
  getCurrentQuestion, 
  submitAnswer, 
  logCheating, 
  evaluateAssessment, 
  getUserAssessments 
} from '../controllers/assessment.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { 
  validateStartAssessment, 
  validateSubmitAnswer, 
  validateCheatLog 
} from '../validators/assessment.validator.js';

const router = express.Router();

router.use(protect); // Protect all routes below

router.post('/start', validateStartAssessment, startAssessment);
router.get('/history', getUserAssessments);
router.get('/:id/question', getCurrentQuestion);
router.post('/:id/answer', validateSubmitAnswer, submitAnswer);
router.post('/:id/cheat', validateCheatLog, logCheating);
router.post('/:id/evaluate', evaluateAssessment);

export default router;
