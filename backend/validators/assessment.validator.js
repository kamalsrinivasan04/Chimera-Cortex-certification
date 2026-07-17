import mongoose from 'mongoose';

/**
 * Validates profile configuration data when starting an assessment.
 */
export const validateStartAssessment = (req, res, next) => {
  const { name, department, jobRole, experience, certificationLevel } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Candidate name is required' });
  }

  if (!department || !department.trim()) {
    return res.status(400).json({ message: 'Department is required' });
  }

  if (!jobRole || !jobRole.trim()) {
    return res.status(400).json({ message: 'Job Role is required' });
  }

  if (experience === undefined || isNaN(experience) || Number(experience) < 0) {
    return res.status(400).json({ message: 'Please provide valid years of experience' });
  }

  if (!certificationLevel || !['Beginner', 'Intermediate', 'Advanced'].includes(certificationLevel)) {
    return res.status(400).json({ message: 'Target certification level must be Beginner, Intermediate, or Advanced' });
  }

  next();
};

/**
 * Validates answer submission parameters.
 */
export const validateSubmitAnswer = (req, res, next) => {
  const { questionId } = req.body;

  if (!questionId) {
    return res.status(400).json({ message: 'Question ID is required' });
  }

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(400).json({ message: 'Invalid Question ID schema' });
  }

  next();
};

/**
 * Validates cheating log payloads.
 */
export const validateCheatLog = (req, res, next) => {
  const { eventType } = req.body;
  const validEvents = [
    'Tab Switch',
    'Browser Minimize',
    'Window Blur',
    'Page Refresh',
    'Copy',
    'Paste',
    'Right Click',
    'Exit Fullscreen',
  ];

  if (!eventType || !validEvents.includes(eventType)) {
    return res.status(400).json({ message: 'Please provide a valid security violation event type' });
  }

  next();
};
