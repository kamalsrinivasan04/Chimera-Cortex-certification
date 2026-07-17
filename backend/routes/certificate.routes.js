import express from 'express';
import { 
  downloadCertificate, 
  verifyCertificate, 
  getUserCertificates 
} from '../controllers/certificate.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public verification route
router.get('/verify/:hash', verifyCertificate);

// Protected routes
router.get('/my-certificates', protect, getUserCertificates);
router.get('/:id/download', protect, downloadCertificate);

export default router;
