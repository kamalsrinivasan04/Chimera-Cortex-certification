import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answerText: {
      type: mongoose.Schema.Types.Mixed, // String, or Array of Strings for MSQ
      default: '',
    },
    timeTaken: {
      type: Number, // in seconds
      default: 0,
    },
    isUnanswered: {
      type: Boolean,
      default: false,
    },
    evaluation: {
      score: {
        type: Number,
        default: 0,
      },
      feedback: {
        type: String,
        default: '',
      },
    },
  },
  { timestamps: true }
);

const Answer = mongoose.model('Answer', answerSchema);
export default Answer;
