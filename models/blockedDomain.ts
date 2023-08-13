import mongoose from 'mongoose';

const blockedDomainSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  domain: {
    type: String,
    required: true
  },
  reason: {
    type: String
  }
});

const ShortUrl =
  mongoose.models.BlockedDomain ||
  mongoose.model('BlockedDomain', blockedDomainSchema);

export default ShortUrl;
