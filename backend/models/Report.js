import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    overallScore: {
      type: Number,
      required: true,
    },
    passFail: {
      type: String,
      enum: ['Pass', 'Fail'],
      required: true,
    },
    topicWiseScore: [
      {
        topic: { type: String, required: true },
        score: { type: Number, required: true },
      },
    ],
    questionTypeWiseScore: [
      {
        questionType: { type: String, required: true },
        score: { type: Number, required: true },
      },
    ],
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    skillGapAnalysis: [
      {
        skill: { type: String, required: true },
        gap: { type: String, required: true }, // e.g. "Low competence", "Proficient"
        recommendedAction: { type: String, required: true },
      },
    ],
    recommendations: {
      type: [String],
      default: [],
    },
    learningSuggestions: [
      {
        topic: { type: String, required: true },
        resources: { type: [String], default: [] },
      },
    ],
    performanceSummary: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
