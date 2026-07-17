import Answer from '../models/Answer.js';
import Question from '../models/Question.js';
import Report from '../models/Report.js';
import { generateFinalReportText } from './groq.service.js';

/**
 * Generates an aggregated analytics report for an assessment attempt.
 * @param {string} assessmentId - ID of the assessment.
 * @param {string} userId - ID of the candidate user.
 * @returns {Promise<Object>} The generated Report document.
 */
export const compileAssessmentReport = async (assessment, userId) => {
  const assessmentId = assessment._id;
  
  // Fetch all answers and corresponding questions
  const answers = await Answer.find({ assessmentId }).populate('questionId');
  
  if (answers.length === 0) {
    throw new Error('No answers found for this assessment');
  }

  let totalScore = 0;
  const topicMap = {};
  const typeMap = {};
  const questionDetails = [];

  // Group scores by topic and type
  answers.forEach((ans) => {
    const q = ans.questionId;
    const score = ans.evaluation.score;
    
    totalScore += score;
    
    // Topic aggregates
    const topic = q.topic || 'General';
    if (!topicMap[topic]) {
      topicMap[topic] = { totalScore: 0, count: 0 };
    }
    topicMap[topic].totalScore += score;
    topicMap[topic].count += 1;

    // Question Type aggregates
    const type = q.type;
    if (!typeMap[type]) {
      typeMap[type] = { totalScore: 0, count: 0 };
    }
    typeMap[type].totalScore += score;
    typeMap[type].count += 1;

    // For OpenAI report text generation
    questionDetails.push({
      text: q.text,
      type: q.type,
      topic: topic,
      score: score,
      feedback: ans.evaluation.feedback,
      answer: ans.answerText,
    });
  });

  const overallScore = Math.round(totalScore / answers.length);
  const passFail = overallScore >= 70 ? 'Pass' : 'Fail';

  // Format Recharts data structures
  const topicWiseScore = Object.keys(topicMap).map((topic) => ({
    topic,
    score: Math.round(topicMap[topic].totalScore / topicMap[topic].count),
  }));

  const questionTypeWiseScore = Object.keys(typeMap).map((type) => ({
    questionType: type,
    score: Math.round(typeMap[type].totalScore / typeMap[type].count),
  }));

  // Fetch AI generated text (strengths, weaknesses, suggestions, etc.)
  const aiReportText = await generateFinalReportText(assessment.profile, {
    overallScore,
    questionsAnswers: questionDetails,
  });

  // Create report document
  const report = await Report.create({
    assessmentId,
    userId,
    overallScore,
    passFail,
    topicWiseScore,
    questionTypeWiseScore,
    strengths: aiReportText.strengths,
    weaknesses: aiReportText.weaknesses,
    skillGapAnalysis: aiReportText.skillGapAnalysis,
    recommendations: aiReportText.recommendations,
    learningSuggestions: aiReportText.learningSuggestions,
    performanceSummary: aiReportText.performanceSummary,
  });

  return report;
};
