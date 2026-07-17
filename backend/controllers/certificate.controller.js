import Certificate from '../models/Certificate.js';
import { generateCertificatePDF } from '../services/pdf.service.js';

// @desc    Download Certificate as PDF
// @route   GET /api/certificates/:id/download
// @access  Private
export const downloadCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      res.status(404);
      throw new Error('Certificate record not found');
    }

    // Verify ownership
    if (certificate.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Unauthorized access to download this certificate');
    }

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certification_${certificate.certificateId}.pdf`);

    // Stream PDF generation directly into Express response object
    await generateCertificatePDF(certificate, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify a certificate authenticity (Public Link)
// @route   GET /api/certificates/verify/:hash
// @access  Public
export const verifyCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({ verificationHash: req.params.hash });

    if (!certificate) {
      return res.status(404).json({
        verified: false,
        message: 'Invalid certificate hash. This certificate could not be verified.',
      });
    }

    res.json({
      verified: true,
      certificate: {
        certificateId: certificate.certificateId,
        name: certificate.name,
        certificationName: certificate.certificationName,
        level: certificate.level,
        score: certificate.score,
        issueDate: certificate.issueDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's certificates
// @route   GET /api/certificates/my-certificates
// @access  Private
export const getUserCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    next(error);
  }
};
