import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    profile: {
      name: { type: String, required: true },
      employeeId: { type: String, default: '' },
      department: { type: String, required: true },
      jobRole: { type: String, required: true },
      experience: { type: Number, required: true },
      skills: { type: [String], default: [] },
      certificationLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['setup', 'active', 'completed', 'terminated'],
      default: 'setup',
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    cheatingCount: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Assessment = mongoose.model('Assessment', assessmentSchema);
export default Assessment;
