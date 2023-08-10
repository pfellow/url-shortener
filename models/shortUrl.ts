import mongoose from 'mongoose';

const shortUrlSchema = new mongoose.Schema({
  fullurl: {
    type: String,
    required: true
  },
  shorturl: {
    type: String,
    requred: true,
    unique: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  userId: {
    type: String
  },
  custom: {
    type: String
  },
  linkpass: {
    type: String
  },
  maxclicks: {
    type: Number
  },
  since: {
    type: String
  },
  till: {
    type: String
  }
});

const ShortUrl =
  mongoose.models.ShortUrl || mongoose.model('ShortUrl', shortUrlSchema);

export default ShortUrl;
