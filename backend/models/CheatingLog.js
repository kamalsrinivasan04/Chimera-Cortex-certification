import mongoose from 'mongoose';

const cheatingLogSchema = new mongoose.Schema(
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
    eventType: {
      type: String,
      required: true,
      enum: [
        'Tab Switch',
        'Browser Minimize',
        'Window Blur',
        'Page Refresh',
        'Copy',
        'Paste',
        'Right Click',
        'Exit Fullscreen',
      ],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const CheatingLog = mongoose.model('CheatingLog', cheatingLogSchema);
export default CheatingLog;
