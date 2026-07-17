import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['MCQ', 'MSQ', 'Short', 'Long', 'Scenario', 'Logical', 'Analytical'],
      required: true,
    },
    options: {
      type: [String],
      default: [],
    },
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed, // String for MCQ/Short/Long/Logical/Analytical/Scenario, Array of Strings for MSQ
    },
    timerDuration: {
      type: Number, // In seconds
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    topic: {
      type: String,
      default: 'General',
    },
  },
  { timestamps: true }
);

const Question = mongoose.model('Question', questionSchema);
export default Question;
