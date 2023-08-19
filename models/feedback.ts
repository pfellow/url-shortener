import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  name: String,
  email: {
    type: String,
    required: true
  },
  ogolink: String,
  reqtype: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  guestId: String,
  ticket: {
    type: String,
    required: true
  }
});

const Feedback =
  mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

export default Feedback;
