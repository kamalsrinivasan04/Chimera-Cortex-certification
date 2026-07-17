import Report from '../models/Report.js';

// @desc    Get assessment report by assessment ID
// @route   GET /api/reports/assessment/:assessmentId
// @access  Private
export const getAssessmentReport = async (req, res, next) => {
  try {
    const report = await Report.findOne({ assessmentId: req.params.assessmentId });

    if (!report) {
      res.status(404);
      throw new Error('Report not found for this assessment');
    }

    if (report.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Unauthorized access to this report');
    }

    res.json(report);
  } catch (error) {
    next(error);
  }
};
